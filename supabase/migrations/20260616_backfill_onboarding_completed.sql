-- Mark onboarding complete for users who already have journal activity
update profiles p
set onboarding_completed = true
where onboarding_completed = false
  and exists (
    select 1 from trades t where t.user_id = p.id
  );
