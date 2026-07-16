-- Jobs table backing the AI Job Impact Tracker dashboard.
-- Run this in the Supabase SQL editor (or ask Lovable to apply it) since this
-- environment has no Supabase CLI session / DB credentials to push it directly.

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  job_title text not null,
  job_category text not null,
  collar_type text not null check (collar_type in ('White Collar', 'Blue Collar')),
  main_tasks text not null,
  ai_exposure_level text not null check (ai_exposure_level in ('High', 'Medium', 'Low')),
  replacement_risk_level text not null check (replacement_risk_level in ('High', 'Medium', 'Low')),
  reason text not null default '',
  human_relevant_skills text not null default '',
  ai_tools_impact text not null default '',
  validation_note text not null default '',
  recommended_action text not null default '',
  confidence_score integer not null default 70 check (confidence_score between 0 and 100),
  validation_status text not null default 'Need Manual Check'
    check (validation_status in ('Validated', 'Need Manual Check', 'Industry Dependent', 'Low Confidence')),
  source_reference text not null default 'User submitted',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

-- Any signed-in user can read the full dataset (seed rows + everyone's additions).
create policy "Authenticated users can view jobs"
  on public.jobs for select
  to authenticated
  using (true);

-- Any signed-in user can add new rows, tagged with their own user id.
create policy "Authenticated users can insert jobs"
  on public.jobs for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Users can only delete rows they personally added (seed data has created_by = null and can't be deleted this way).
create policy "Users can delete their own jobs"
  on public.jobs for delete
  to authenticated
  using (auth.uid() = created_by);

-- Seed data ported from the original static src/lib/jobs-data.ts dataset.
insert into public.jobs (job_title, job_category, collar_type, main_tasks, ai_exposure_level, replacement_risk_level, reason, human_relevant_skills, ai_tools_impact, validation_note, recommended_action, confidence_score, validation_status, source_reference)
values
  ('Data Entry Clerk', 'Administration', 'White Collar', 'Input data, validate records, update spreadsheets, and maintain databases.', 'High', 'High', 'Highly repetitive, digital, and rule-based work that is straightforward to automate with AI and workflow tools.', 'Accuracy checking, domain knowledge, exception handling.', 'ChatGPT, OCR tools, spreadsheet automation, RPA.', 'Needs manual check for industry-specific workflows.', 'Automate routine tasks', 88, 'Validated', 'ILO/WEF-inspired classification'),
  ('Customer Service Agent', 'Service', 'White Collar', 'Respond to customer questions, handle complaints, and provide product information.', 'High', 'Medium', 'Many standard responses are automatable, but complex complaints and emotional situations still require human judgment.', 'Empathy, negotiation, escalation handling, emotional intelligence.', 'AI chatbots, CRM assistants, call summarization.', 'Risk depends on industry and customer complexity.', 'Use AI as productivity assistant', 74, 'Industry Dependent', 'Internal workshop dataset'),
  ('Nurse', 'Healthcare', 'White Collar', 'Provide patient care, monitor conditions, assist doctors, and communicate with families.', 'Medium', 'Low', 'AI can assist documentation and monitoring, but direct patient care requires human presence, empathy, and clinical accountability.', 'Patient care, empathy, clinical judgment, communication.', 'Clinical documentation assistants, diagnostic support tools.', 'AI supports the role but does not replace core responsibility.', 'Prioritize human judgment', 90, 'Validated', 'OECD-inspired classification'),
  ('Content Writer (General)', 'Media', 'White Collar', 'Write blog posts, product descriptions, and social media captions.', 'High', 'High', 'Generic writing tasks are easily replicated by generative AI at scale.', 'Editorial judgment, brand voice, original research.', 'ChatGPT, Jasper, Copy.ai.', 'Specialized or investigative writing remains resilient.', 'Reskill into AI supervision', 82, 'Validated', 'Internal workshop dataset'),
  ('Telemarketer', 'Sales', 'White Collar', 'Cold call leads, pitch products, log call outcomes.', 'High', 'High', 'Scripted, high-volume outreach can be handled by AI voice agents and automated dialers.', 'Relationship building, complex objection handling.', 'AI voice agents, auto-dialers, LLM script generators.', 'High-value B2B outreach still needs human closers.', 'Automate routine tasks', 85, 'Validated', 'WEF-inspired classification'),
  ('Transcriptionist', 'Administration', 'White Collar', 'Convert audio recordings into written text.', 'High', 'High', 'Modern speech-to-text models handle most transcription accurately.', 'Legal/medical terminology, quality assurance.', 'Whisper, Otter.ai, Rev AI.', 'Specialized domains still require human QA.', 'Redesign workflow around AI tools', 87, 'Validated', 'Internal workshop dataset'),
  ('Graphic Designer', 'Media', 'White Collar', 'Create visual assets, illustrations, and layout designs.', 'High', 'Medium', 'Generative image tools accelerate ideation, but brand and art direction still need designers.', 'Art direction, brand consistency, creative critique.', 'Midjourney, Adobe Firefly, Canva AI.', 'Senior/creative direction roles are more resilient.', 'Use AI as productivity assistant', 70, 'Industry Dependent', 'Internal workshop dataset'),
  ('Software Engineer', 'Technology', 'White Collar', 'Design, build, and maintain software systems.', 'High', 'Medium', 'AI assistants boost productivity dramatically, but system design and accountability require humans.', 'System design, debugging, cross-team communication.', 'GitHub Copilot, Cursor, code review assistants.', 'Junior roles more affected than senior.', 'Use AI as productivity assistant', 78, 'Validated', 'OECD-inspired classification'),
  ('Accountant', 'Finance', 'White Collar', 'Prepare financial records, reconciliations, and tax filings.', 'High', 'Medium', 'Bookkeeping is heavily automatable; audit judgment and advisory work remain human.', 'Advisory, ethics, complex regulatory judgment.', 'AI bookkeeping, Xero, QuickBooks copilots.', 'CPA-level judgment is safer than transactional work.', 'Reskill into AI supervision', 76, 'Validated', 'WEF-inspired classification'),
  ('Paralegal', 'Legal', 'White Collar', 'Draft documents, research case law, and manage case files.', 'High', 'Medium', 'Legal research and drafting are increasingly AI-assisted.', 'Client interaction, jurisdictional judgment.', 'Harvey AI, Casetext CoCounsel.', 'Specialized practice areas remain safer.', 'Redesign workflow around AI tools', 72, 'Industry Dependent', 'Internal workshop dataset'),
  ('Electrician', 'Skilled Trades', 'Blue Collar', 'Install and repair electrical systems in buildings and industrial sites.', 'Low', 'Low', 'Physical, on-site, and safety-critical work is hard to automate.', 'Manual dexterity, safety judgment, field problem-solving.', 'Diagnostic apps, scheduling tools.', 'AI mostly augments planning, not fieldwork.', 'Use AI only as support tool', 92, 'Validated', 'OECD-inspired classification'),
  ('Plumber', 'Skilled Trades', 'Blue Collar', 'Install and maintain piping systems, fix leaks, and troubleshoot on-site.', 'Low', 'Low', 'Physical inspection and repair in unpredictable environments.', 'Manual dexterity, judgment in confined spaces.', 'Booking/dispatch platforms.', 'Low risk short and medium term.', 'Monitor industry-specific change', 91, 'Validated', 'ILO-inspired classification'),
  ('Warehouse Worker', 'Logistics', 'Blue Collar', 'Pick, pack, and move goods across a warehouse.', 'Medium', 'Medium', 'Robotics and warehouse automation are advancing, but many facilities still rely on human labor.', 'Adaptability, exception handling.', 'Robotics, warehouse management systems.', 'Depends on capex and facility maturity.', 'Monitor industry-specific change', 68, 'Industry Dependent', 'WEF-inspired classification'),
  ('Truck Driver', 'Logistics', 'Blue Collar', 'Transport goods over long or short distances.', 'Medium', 'Medium', 'Autonomous trucking is progressing but regulatory and operational barriers remain.', 'Route judgment, cargo handling, customer interaction.', 'ADAS, route optimization, autonomous pilots.', 'Long tail before full automation is realistic.', 'Reskill into AI supervision', 65, 'Industry Dependent', 'OECD-inspired classification'),
  ('Teacher', 'Education', 'White Collar', 'Design lessons, teach students, and assess learning outcomes.', 'Medium', 'Low', 'Teaching involves mentorship, motivation, and social dynamics AI cannot replicate.', 'Mentorship, empathy, classroom management.', 'Lesson planners, grading assistants, tutors.', 'AI augments; does not replace teacher-student relationship.', 'Use AI as productivity assistant', 84, 'Validated', 'OECD-inspired classification'),
  ('Field Technician', 'Skilled Trades', 'Blue Collar', 'Install, service, and repair equipment on site.', 'Low', 'Low', 'Requires physical presence and situational judgment on site.', 'Diagnosis, manual dexterity, customer interaction.', 'AR-assisted repair, ticketing systems.', 'Low near-term risk.', 'Use AI only as support tool', 89, 'Validated', 'ILO-inspired classification'),
  ('Marketing Manager', 'Marketing', 'White Collar', 'Plan campaigns, manage budgets, and coordinate teams.', 'Medium', 'Low', 'Strategy, stakeholder alignment, and brand judgment stay human.', 'Strategy, leadership, stakeholder management.', 'AI copywriting, analytics, campaign generators.', 'Operational marketers more exposed than strategists.', 'Use AI as productivity assistant', 77, 'Validated', 'Internal workshop dataset'),
  ('HR Recruiter', 'Human Resources', 'White Collar', 'Source candidates, screen resumes, coordinate interviews.', 'High', 'Medium', 'Sourcing and screening automate well; final judgment stays human.', 'Interviewing, candidate empathy, hiring judgment.', 'AI sourcing, resume parsing, scheduling bots.', 'Bias risks require human oversight.', 'Redesign workflow around AI tools', 74, 'Need Manual Check', 'Internal workshop dataset'),
  ('Financial Analyst', 'Finance', 'White Collar', 'Model financials, prepare reports, and support decisions.', 'High', 'Medium', 'Modeling and reporting speed up with AI; interpretation stays human.', 'Business judgment, storytelling with data.', 'Copilot for Excel, AI research assistants.', 'Senior analysts more resilient.', 'Reskill into AI supervision', 75, 'Validated', 'OECD-inspired classification'),
  ('Chef', 'Hospitality', 'Blue Collar', 'Design menus, cook meals, and manage kitchen operations.', 'Low', 'Low', 'Creativity, taste, and hands-on kitchen work are hard to automate at scale.', 'Palate, creativity, team leadership.', 'Recipe suggestion, inventory tools.', 'QSR back-of-house may see more automation.', 'Use AI only as support tool', 86, 'Validated', 'Internal workshop dataset'),
  ('Retail Cashier', 'Retail', 'Blue Collar', 'Process transactions, handle payments, and assist customers.', 'High', 'High', 'Self-checkout and cashierless stores replace many transactions.', 'Customer support, exception handling.', 'Self-checkout, computer vision checkout.', 'Some segments retain cashiers for service reasons.', 'Reskill into AI supervision', 80, 'Validated', 'WEF-inspired classification'),
  ('Translator', 'Media', 'White Collar', 'Translate documents and localize content.', 'High', 'High', 'Machine translation now handles most non-critical content.', 'Cultural nuance, legal/medical accuracy.', 'DeepL, GPT-based translators.', 'Specialized translators still needed.', 'Redesign workflow around AI tools', 83, 'Validated', 'Internal workshop dataset'),
  ('Journalist', 'Media', 'White Collar', 'Investigate stories, interview sources, and publish articles.', 'Medium', 'Medium', 'AI drafts routine news; investigative and source-based journalism stays human.', 'Source cultivation, investigative judgment, ethics.', 'Draft assistants, transcription, research tools.', 'Beat and investigative reporters more resilient.', 'Use AI as productivity assistant', 69, 'Industry Dependent', 'Internal workshop dataset'),
  ('Radiologist', 'Healthcare', 'White Collar', 'Interpret medical imaging and support diagnoses.', 'High', 'Medium', 'AI reads images fast; final diagnosis and accountability stay human.', 'Clinical judgment, patient communication.', 'Radiology AI, computer-aided detection.', 'Workflows augmented, not replaced.', 'Reskill into AI supervision', 72, 'Validated', 'OECD-inspired classification'),
  ('Construction Worker', 'Construction', 'Blue Collar', 'Build structures on-site, operate tools and equipment.', 'Low', 'Low', 'Physical, site-specific work is hard to automate broadly.', 'Craftsmanship, safety, teamwork.', 'Planning tools, safety monitoring.', 'Prefab may shift some roles.', 'Monitor industry-specific change', 88, 'Validated', 'ILO-inspired classification'),
  ('Social Worker', 'Social Services', 'White Collar', 'Support vulnerable individuals and coordinate services.', 'Low', 'Low', 'Deep empathy and relationship work AI cannot replace.', 'Empathy, ethical judgment, community trust.', 'Case management tools, documentation aids.', 'AI supports paperwork; not the core role.', 'Prioritize human judgment', 90, 'Validated', 'OECD-inspired classification'),
  ('Basic Admin Assistant', 'Administration', 'White Collar', 'Schedule meetings, manage inbox, prepare basic documents.', 'High', 'High', 'Scheduling and inbox management largely automatable.', 'Exception handling, discretion.', 'AI schedulers, inbox copilots.', 'Executive assistants more resilient.', 'Automate routine tasks', 84, 'Validated', 'Internal workshop dataset'),
  ('UX Designer', 'Technology', 'White Collar', 'Research users and design interfaces and flows.', 'Medium', 'Medium', 'AI accelerates wireframing but user research and judgment remain.', 'User empathy, research synthesis.', 'Uizard, Figma AI, Galileo.', 'Senior UX more resilient.', 'Use AI as productivity assistant', 71, 'Validated', 'Internal workshop dataset'),
  ('Delivery Driver', 'Logistics', 'Blue Collar', 'Deliver parcels and food to customer addresses.', 'Medium', 'Medium', 'Autonomous delivery still limited; last-mile logistics remains largely human.', 'Navigation, customer interaction, adaptability.', 'Route optimization, delivery robots.', 'Depends on city regulations.', 'Monitor industry-specific change', 66, 'Industry Dependent', 'Internal workshop dataset'),
  ('Therapist', 'Healthcare', 'White Collar', 'Provide mental health counseling and therapy.', 'Low', 'Low', 'Therapeutic relationship and accountability are fundamentally human.', 'Empathy, active listening, clinical ethics.', 'Journaling apps, session notes, triage bots.', 'AI supports; not a replacement.', 'Prioritize human judgment', 92, 'Validated', 'OECD-inspired classification'),
  ('Bookkeeper', 'Finance', 'White Collar', 'Record transactions and maintain ledgers.', 'High', 'High', 'Rule-based and highly digital; AI accounting tools handle most of it.', 'Reconciliation judgment, client communication.', 'AI accounting, bank feeds, auto-categorization.', 'Advisory roles more resilient.', 'Automate routine tasks', 86, 'Validated', 'WEF-inspired classification'),
  ('Security Guard', 'Security', 'Blue Collar', 'Patrol premises, monitor cameras, and respond to incidents.', 'Medium', 'Low', 'AI cameras assist monitoring but physical presence still required for response.', 'Situational judgment, physical response.', 'Video analytics, anomaly detection.', 'AI augments monitoring only.', 'Use AI only as support tool', 78, 'Validated', 'Internal workshop dataset');

