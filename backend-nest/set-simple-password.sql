-- Set simple password for testing
-- Password: password
UPDATE "User" 
SET password = '$2b$10$XX9y7ddrpCXGWtoKFAfV9uhSScCzC4TAqd00BCfS1EwlMqi6AbuDS'
WHERE email = 'admin@vetpicurean.com';

-- Verify
SELECT email, 
       CASE 
         WHEN password = '$2b$10$XX9y7ddrpCXGWtoKFAfV9uhSScCzC4TAqd00BCfS1EwlMqi6AbuDS' THEN 'UPDATED'
         ELSE 'NOT_UPDATED'
       END as status
FROM "User"
WHERE email = 'admin@vetpicurean.com';
