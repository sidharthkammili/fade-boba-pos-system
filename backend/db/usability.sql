CREATE TABLE IF NOT EXISTS Usability_Feedback (
  feedback_id SERIAL PRIMARY KEY,
  participant_name TEXT NOT NULL,
  interface_view TEXT NOT NULL,
  task_label TEXT NOT NULL,
  task_success BOOLEAN NOT NULL,
  ease_rating INTEGER CHECK (ease_rating BETWEEN 1 AND 5),
  completion_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usability_interface_created
ON Usability_Feedback (interface_view, created_at DESC);