use std::sync::{Arc, Mutex};

use llm::{InferenceSession, InferenceSessionConfig};

use crate::model::Model;

pub struct ModelSession<'a, M: llm::Model> {
  pub(crate) model: &'a Model<M>,
  pub(crate) session: Arc<Mutex<InferenceSession>>,
}

impl<'a, M: llm::Model> ModelSession<'a, M> {
  pub fn new(model: &'a Model<M>, config: InferenceSessionConfig) -> Self {
    ModelSession {
      session: Arc::new(Mutex::new(model.inner.start_session(config))),
      model,
    }
  }
}
