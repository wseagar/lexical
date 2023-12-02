use std::{sync::Arc, thread, time::SystemTime};

use futures::{channel::mpsc, Stream, TryStream};
use itertools::Itertools;
use llm::InferenceError;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::session::ModelSession;

// TODO: determine the best value for buffer size
const BUFFER_SIZE: usize = 50;


// {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo-0613", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

/// A chat completition request.
///
/// Mirrors the OpenAI API streaming format: https://platform.openai.com/docs/api-reference/chat/streaming
/// ```json
/// {
///   "model": "gpt-3.5-turbo",
///   "messages": [
///     {
///       "role": "system",
///       "content": "You are a helpful assistant."
///     },
///     {
///       "role": "user",
///       "content": "Hello!"
///     }
///   ],
///   "stream": true
/// }
/// ````
#[derive(Debug, Deserialize)]
pub struct CompletionRequest<'a> {
  pub model: &'a str,
  pub messages: Vec<CompletionRequestMessage<'a>>,
  pub stream: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CompletionRequestRole {
  System,
  User,
}

#[derive(Debug, Deserialize)]
pub struct CompletionRequestMessage<'a> {
  role: CompletionRequestRole,
  content: &'a str,
}

/// A streamed chat completion chunk.
///
/// ```json
/// {
///   "id": "chatcmpl-123",
///   "object": "chat.completion.chunk",
///   "created": 1694268190,
///   "model": "gpt-3.5-turbo-0613",
///   "system_fingerprint": "fp_44709d6fcb",
///   "choices": [
///     {
///       "index": 0,
///       "delta": { "role": "assistant", "content": "" },
///       "finish_reason": null
///     }
///   ]
/// }
/// ``
#[derive(Debug, Serialize)]
pub struct CompletionResponseChunk {
  id: Uuid,
  object: &'static str,
  created: u64,
  model: String,
  system_fingerprint: String,
  choices: Vec<CompletionResponseChoice>,
}

#[derive(Debug, Serialize)]
pub struct CompletionResponseChoice {
  index: u8,
  delta: CompletionResponseDelta,
  finish_reason: Option<CompletionResponseFinishReason>,
}

/// The reason the model stopped generating tokens.
/// This will be `Stop` if the model hit a natural stop point or a provided stop sequence,
/// `Length` if the maximum number of tokens specified in the request was reached,
/// `ContentFilter` if content was omitted due to a flag from our content filters,
/// `ToolCalls` if the model called a tool.
#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum CompletionResponseFinishReason {
  Stop,
  Length,
  ContentFilter,
  ToolCalls,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum CompletionResponseRole {
  Assistant,
}

#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum CompletionResponseDelta {
  Role { role: CompletionResponseRole },
  Content { content: String },
  Empty {},
}

impl<'a, M: llm::Model> ModelSession<'a, M> {
  pub fn stream_completion<'b>(
    &'b self,
    request: CompletionRequest<'b>,
  ) -> impl TryStream<Ok = CompletionResponseChunk, Error = InferenceError> + 'b
  where
    'b: 'a,
  {
    // TODO: checked streamed and model on request

    let created = SystemTime::now()
      .duration_since(SystemTime::UNIX_EPOCH)
      .expect("time must be after Unix epoch")
      .as_secs();

    let system_fingerprint = String::new();
    let prompt: String =
      itertools::Itertools::intersperse(request.messages.into_iter().map(|message| message.content), "\n").collect();
    let id = Uuid::new_v4();

    // TODO: try and make this borrow from self
    let model_name = self.model.name().to_string();

    let (mut tx, mut rx) = mpsc::channel::<Result<CompletionResponseChunk, InferenceError>>(BUFFER_SIZE);
    tx.try_send(Ok(CompletionResponseChunk {
      id,
      object: "chat.completion.chunk",
      created,
      model: model_name.clone(),
      system_fingerprint: system_fingerprint.clone(),
      choices: vec![CompletionResponseChoice {
        index: 0,
        delta: CompletionResponseDelta::Role {
          role: CompletionResponseRole::Assistant,
        },
        finish_reason: None,
      }],
    }));

    let session_ref = Arc::clone(&self.session);

    thread::spawn(move || {
      let session = session_ref.lock().unwrap();
      let result = session.infer::<InferenceError>(
        &self.model.inner,
        &mut rand::thread_rng(),
        &llm::InferenceRequest {
          prompt: llm::Prompt::Text(&prompt),
          parameters: &llm::InferenceParameters::default(),
          play_back_previous_tokens: false,
          maximum_token_count: None,
        },
        &mut Default::default(),
        |response| match response {
          llm::InferenceResponse::InferredToken(token) => {
            if let Err(_) = tx.try_send(Ok(CompletionResponseChunk {
              id,
              object: "chat.completion.chunk",
              created,
              model: model_name.clone(),
              system_fingerprint: system_fingerprint.clone(),
              choices: vec![CompletionResponseChoice {
                index: 0,
                delta: CompletionResponseDelta::Content { content: token },
                finish_reason: None,
              }],
            })) {
              Ok(llm::InferenceFeedback::Halt)
            }
            else {
              Ok(llm::InferenceFeedback::Continue)
            }
          }
          llm::InferenceResponse::EotToken => {
            tx.try_send(Ok(CompletionResponseChunk {
              id,
              object: "chat.completion.chunk",
              created,
              model: model_name.clone(),
              system_fingerprint: system_fingerprint.clone(),
              choices: vec![CompletionResponseChoice {
                index: 0,
                delta: CompletionResponseDelta::Empty {},
                finish_reason: Some(CompletionResponseFinishReason::Stop),
              }],
            }))
            .ok();

            Ok(llm::InferenceFeedback::Halt)
          }
          _ => Ok(llm::InferenceFeedback::Continue),
        },
      );
    });

    rx
  }
}
