# Third parties

Answers: which external services does this project talk to, and which identifiers are safe to write down? Tenant IDs, client IDs, hostnames and account names belong here. Secret values never do; they live only in `.env`.

| Service | Purpose | Safe identifiers | Rotation steps |
|---|---|---|---|
| GitHub | repo `balint-bertok/zaapi-take-home`, CI | account `balint-bertok` | n/a |
