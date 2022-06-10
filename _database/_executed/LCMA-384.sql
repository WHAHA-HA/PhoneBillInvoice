ALTER TABLE common_dictionary
ADD  abbreviation character varying,
ADD color json;

UPDATE common_dictionary SET abbreviation='CK', color='{"background":"blue", "color":"white"}' WHERE id = 24;
UPDATE common_dictionary SET abbreviation='WR', color='{"background":"red", "color":"white"}' WHERE id = 25;
UPDATE common_dictionary SET abbreviation='MP', color='{"background":"green", "color":"white"}' WHERE id = 27;
UPDATE common_dictionary SET abbreviation='SP', color='{"background":"blue", "color":"white"}' WHERE id = 46;
UPDATE common_dictionary SET abbreviation='MD', color='{"background":"yellow", "color":"white"}' WHERE id = 47;
UPDATE common_dictionary SET abbreviation='TN', color='{"background":"purple", "color":"white"}' WHERE id = 48;
UPDATE common_dictionary SET abbreviation='TF', color='{"background":"orange", "color":"white"}' WHERE id = 49;
