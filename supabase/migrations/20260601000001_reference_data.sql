-- =============================================================
-- OFFSCRIPT  ·  Migration 001  ·  Reference Data Foundation
-- Phase 1 MVP  ·  Chunk 1 of 3
-- =============================================================
-- (1) Rating scale enum
-- (2) intents              — 5 rows
-- (3) signals              — 16 rows (5 universal + 11 archetype)
-- (4) archetypes           — 5 rows with signal sets
-- (5) practice_prompts     — 50 placeholder prompts
-- No user-scoped tables and no RLS — those come in Chunks 2 and 3.
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE rating_label AS ENUM (
  'Blocked','Emerging','Present','Strong','Signature'
);

CREATE TABLE intents (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  description   text NOT NULL,
  display_order int  NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO intents (id, name, description, display_order) VALUES
  ('teach',     'Teach',     'Share knowledge or explain something',  1),
  ('sell',      'Sell',      'Promote a product, service, or offer',  2),
  ('connect',   'Connect',   'Build connection and relate to others', 3),
  ('entertain', 'Entertain', 'Share stories, laugh, or shine',        4),
  ('motivate',  'Motivate',  'Inspire or encourage action',           5);

CREATE TABLE signals (
  id          text PRIMARY KEY,
  code        text NOT NULL,
  name        text NOT NULL,
  category    text NOT NULL,
  description text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_signals_category ON signals(category);

INSERT INTO signals (id, code, name, category, description) VALUES
  ('uq1_clarity',  'UQ1', 'Clarity & Direction',     'universal',
   'Does the creator know where they''re going and bring the viewer with them?'),
  ('uq2_hook',     'UQ2', 'Hook & Opening',          'universal',
   'Does the opening earn attention without manipulation?'),
  ('uq3_value',    'UQ3', 'Value & Insight',         'universal',
   'Does the creator deliver something worth the viewer''s time?'),
  ('uq4_presence', 'UQ4', 'Presence & Authenticity', 'universal',
   'Does the creator sound like themselves, fully present?'),
  ('uq5_closing',  'UQ5', 'Closing & Payoff',        'universal',
   'Does the ending land with intention?');

INSERT INTO signals (id, code, name, category, description) VALUES
  ('warmth',               'WARMTH',        'Warmth',               'presence',
   'Conveys genuine care and approachability'),
  ('conversational_flow',  'CONV_FLOW',     'Conversational Flow',  'structure',
   'Speaks naturally, without scripted stiffness'),
  ('conviction',           'CONVICTION',    'Conviction',           'presence',
   'Speaks with belief in what they''re saying'),
  ('action_clarity',       'ACTION',        'Action Clarity',       'structure',
   'Makes clear what the viewer should think, feel, or do'),
  ('payoff_clarity',       'PAYOFF',        'Payoff Clarity',       'structure',
   'The viewer leaves knowing what they got'),
  ('authenticity',         'AUTHENTICITY',  'Authenticity',         'presence',
   'Feels honest and unguarded'),
  ('specificity',          'SPECIFICITY',   'Specificity',          'structure',
   'Uses concrete details over vague claims'),
  ('narrative_momentum',   'NARRATIVE',     'Narrative Momentum',   'resonance',
   'Story moves forward — tension, change, payoff'),
  ('digestibility',        'DIGESTIBILITY', 'Digestibility',        'structure',
   'Complex ideas land clearly without dumbing down'),
  ('hook_strength',        'HOOK',          'Hook Strength',        'structure',
   'Opening earns attention quickly'),
  ('emotional_congruence', 'EMOTIONAL',     'Emotional Congruence', 'resonance',
   'Tone matches the message — what they say and how they say it align');

CREATE TABLE archetypes (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  description   text NOT NULL,
  signal_set    text[] NOT NULL,
  display_order int  NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT archetype_signal_count CHECK (array_length(signal_set, 1) = 5)
);

INSERT INTO archetypes (id, name, description, signal_set, display_order) VALUES
  ('the_guide','The Guide',
   'Warm, clear, stepwise — leads with calm authority earned through helpfulness.',
   ARRAY['warmth','conversational_flow','conviction','action_clarity','payoff_clarity'], 1),
  ('the_friend','The Friend',
   'Warm, conversational, personal — the voice that makes a viewer feel seen.',
   ARRAY['warmth','authenticity','conversational_flow','specificity','narrative_momentum'], 2),
  ('the_expert','The Expert',
   'Precise, structured, evidence-grounded — credibility through clarity, not confidence theater.',
   ARRAY['conviction','specificity','digestibility','payoff_clarity','hook_strength'], 3),
  ('the_storyteller','The Storyteller',
   'Narrative-forward, sensory, emotionally alive — pulls the viewer into a moment.',
   ARRAY['emotional_congruence','authenticity','narrative_momentum','specificity','hook_strength'], 4),
  ('the_challenger','The Challenger',
   'Direct, confrontational, activating — names what others avoid.',
   ARRAY['conviction','hook_strength','action_clarity','specificity','emotional_congruence'], 5);

CREATE TABLE practice_prompts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  archetype_id   text NOT NULL REFERENCES archetypes(id) ON DELETE CASCADE,
  intent_id      text NOT NULL REFERENCES intents(id)    ON DELETE CASCADE,
  prompt_text    text NOT NULL,
  is_placeholder boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_practice_prompts_archetype_intent
  ON practice_prompts(archetype_id, intent_id);

INSERT INTO practice_prompts (archetype_id, intent_id, prompt_text) VALUES
  ('the_guide','teach',     'Walk someone through a process you''ve done a hundred times — slowly, like it''s their first.'),
  ('the_guide','teach',     'Explain a concept by starting with where most people get stuck.'),
  ('the_guide','sell',      'Describe what changes for the person on the other side of buying.'),
  ('the_guide','sell',      'Name the specific problem you solve, in their words, not yours.'),
  ('the_guide','connect',   'Tell a viewer something you wish someone had told you when you were starting.'),
  ('the_guide','connect',   'Acknowledge a struggle your audience is in the middle of right now.'),
  ('the_guide','entertain', 'Tell a story from your work that ended in a useful surprise.'),
  ('the_guide','entertain', 'Share a moment when you got something wrong in a way that taught you more than getting it right would have.'),
  ('the_guide','motivate',  'Tell someone what becomes possible if they keep going for one more week.'),
  ('the_guide','motivate',  'Talk about the small, unglamorous habit that compounds the most.'),
  ('the_friend','teach',     'Explain something to one specific friend, by name, in your head.'),
  ('the_friend','teach',     'Talk through something you only recently figured out.'),
  ('the_friend','sell',      'Tell the story of the first time your product helped someone, in their voice.'),
  ('the_friend','sell',      'Recommend what you''re selling the way you''d text a friend about it.'),
  ('the_friend','connect',   'Share a small moment from this week that mattered more than it should have.'),
  ('the_friend','connect',   'Tell a viewer about a time you felt the exact thing they''re feeling right now.'),
  ('the_friend','entertain', 'Tell the story of the most ridiculous thing that''s happened to you this month.'),
  ('the_friend','entertain', 'Share a small embarrassment that aged into a great story.'),
  ('the_friend','motivate',  'Encourage someone in the voice you''d use with a close friend on a hard day.'),
  ('the_friend','motivate',  'Tell a viewer the one thing you''d say if you could only say one thing.'),
  ('the_expert','teach',     'Explain something in your field that beginners almost always get wrong.'),
  ('the_expert','teach',     'Define a term everyone uses casually and almost no one uses precisely.'),
  ('the_expert','sell',      'Make the strongest possible case for your product in 60 seconds, with one specific example.'),
  ('the_expert','sell',      'Explain the actual mechanism behind why your product works.'),
  ('the_expert','connect',   'Share the unsexy truth about what your work actually looks like.'),
  ('the_expert','connect',   'Name the thing your industry pretends isn''t real.'),
  ('the_expert','entertain', 'Tell the story of a famous mistake in your field — and what it really taught everyone.'),
  ('the_expert','entertain', 'Walk through a counter-intuitive truth that sounds wrong but isn''t.'),
  ('the_expert','motivate',  'Tell a beginner exactly what to focus on for the next 30 days.'),
  ('the_expert','motivate',  'Make the case for why patience compounds faster than intensity in your field.'),
  ('the_storyteller','teach',     'Teach a concept by telling the story of when you learned it.'),
  ('the_storyteller','teach',     'Open with a moment, then arrive at the lesson.'),
  ('the_storyteller','sell',      'Tell the story of the person your product is for — before they found it, and after.'),
  ('the_storyteller','sell',      'Share the origin moment of why you started building this.'),
  ('the_storyteller','connect',   'Tell a viewer about a moment that changed how you see someone close to you.'),
  ('the_storyteller','connect',   'Describe a feeling you''ve never quite found the right words for.'),
  ('the_storyteller','entertain', 'Tell a story where the ending isn''t the one anyone would expect.'),
  ('the_storyteller','entertain', 'Walk us through the strangest 24 hours of your year.'),
  ('the_storyteller','motivate',  'Tell the story of someone who started where the viewer is now.'),
  ('the_storyteller','motivate',  'Describe the moment you decided not to give up.'),
  ('the_challenger','teach',     'Teach by attacking a popular belief that''s actually wrong.'),
  ('the_challenger','teach',     'Name the lazy version of your field, then teach the real version.'),
  ('the_challenger','sell',      'Tell viewers what they''re doing wrong that your product fixes.'),
  ('the_challenger','sell',      'Call out the worse alternative people settle for, by name.'),
  ('the_challenger','connect',   'Say the thing your audience already thinks but won''t say out loud.'),
  ('the_challenger','connect',   'Push back on advice your audience is constantly given.'),
  ('the_challenger','entertain', 'Pick a fight with a take that everyone agrees with — and defend the other side.'),
  ('the_challenger','entertain', 'Make a confident case for an unpopular opinion.'),
  ('the_challenger','motivate',  'Tell the viewer what they''re actually capable of, and stop letting them off the hook.'),
  ('the_challenger','motivate',  'Name the excuse the viewer needs to drop today.');
