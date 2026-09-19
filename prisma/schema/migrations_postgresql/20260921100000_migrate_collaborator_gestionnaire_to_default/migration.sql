-- Count!: map legacy BC organization roles to the single DEFAULT collaborator role.

UPDATE public.accounts
SET role = 'DEFAULT'
WHERE role IN ('COLLABORATOR', 'GESTIONNAIRE');
