use std::sync::{Arc, Mutex};

use llm::{InferenceSession, InferenceSessionConfig};

use crate::model::Model;

pub struct ModelSession<M: llm::Model> {
  pub(crate) session: Arc<Mutex<InferenceSession>>,
  pub(crate) model: Arc<Model<M>>,
}

impl<M: llm::Model> ModelSession<M> {
  pub fn new(model: Arc<Model<M>>, config: InferenceSessionConfig) -> Self {
    ModelSession {
      session: Arc::new(Mutex::new(model.inner.start_session(config))),
      model,
    }
  }
}
