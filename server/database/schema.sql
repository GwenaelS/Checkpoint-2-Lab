CREATE DATABASE IF NOT EXISTS checkpoint2lab;
USE checkpoint2lab;

CREATE TABLE user (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  username VARCHAR(50),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('To Do', 'In Progress', 'Done') DEFAULT 'To Do',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NOT NULL,
  FOREIGN KEY(created_by) REFERENCES user(id)
);

CREATE TABLE user_project (
  user_id INT UNSIGNED NOT NULL,
  project_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, project_id),
  FOREIGN KEY(user_id) REFERENCES user(id),
  FOREIGN KEY(project_id) REFERENCES project(id)
);

CREATE TABLE task (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('To Do', 'In Progress', 'Done') DEFAULT 'To Do',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INT UNSIGNED NOT NULL,
  project_id INT UNSIGNED NOT NULL,
  FOREIGN KEY(user_id) REFERENCES user(id),
  FOREIGN KEY(project_id) REFERENCES project(id)
);

INSERT INTO user(username, email, password) VALUES ("SamynPro", "samyngwenaelpro@gmail.com", "12345");
INSERT INTO user(username, email, password) VALUES ("SamynPerso", "samyngwenael@gmail.com", "12345");

INSERT INTO project(title, description, created_by) VALUES ("Project 1", "Description for Project 1", 1);
INSERT INTO project(title, description, created_by) VALUES ("Project 2", "Description for Project 2", 2);
INSERT INTO project(title, description, created_by) VALUES ("Project 3", "Description for Project 3", 2);

INSERT INTO task(title, description, status, user_id, project_id) VALUES ("Task 1", "Description Task 1 for Project 1", "Done", 1, 1);
INSERT INTO task(title, description, status, user_id, project_id) VALUES ("Task 2", "Description Task 2 for Project 1", "In Progress", 2, 1);
INSERT INTO task(title, description, status, user_id, project_id) VALUES ("Task 3", "Description Task 3 for Project 1", "To Do", 2, 1);

INSERT INTO task(title, description, status, user_id, project_id) VALUES ("Task 1", "Description Task 1 for Project 2", "To Do", 1, 2);
INSERT INTO task(title, description, status, user_id, project_id) VALUES ("Task 2", "Description Task 2 for Project 2", "To Do", 2, 2);
