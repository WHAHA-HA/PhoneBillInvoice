-- Table: usage_performance

-- DROP TABLE usage_performance;

CREATE TABLE usage_performance
(
  id integer NOT NULL,
  cpu numeric,
  memory numeric,
  network numeric,
  performance_date date,
  CONSTRAINT performance_pkey PRIMARY KEY (id)
)
INSERT INTO usage_performance VALUES (1, 80, 90, 20, '2016-07-06');
INSERT INTO usage_performance VALUES (2, 70, 80, 89, '2016-06-02');
INSERT INTO usage_performance VALUES (3, 65, 20, 29, '2016-07-03');


-- Table: usage_utilization
CREATE TABLE usage_utilization
(
  id integer NOT NULL,
  lan numeric,
  speed numeric,
  offline numeric,

  CONSTRAINT utilization_pkey PRIMARY KEY (id)
)

INSERT INTO usage_utilization VALUES (1, 100, 20, 40);
INSERT INTO usage_utilization VALUES (2, 50, 10, 20);
INSERT INTO usage_utilization VALUES (3, 80, 30, 20);


