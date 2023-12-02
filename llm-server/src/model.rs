pub struct Model<M: llm::Model> {
  pub(crate) inner: M,
}

impl<M: llm::Model> Model<M> {
  pub fn name(&self) -> &str {
    "todo"
  }
}
