//! Perfoms the underlying execution (i.e. inference) of the models we host.

pub mod completion;
mod model;
mod session;

pub use crate::{model::Model, session::ModelSession};
