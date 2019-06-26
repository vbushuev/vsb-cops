#TASK

## Z-Pay Backend Test Case

**Note: The overall architecture vision is necessary. Following that a partial implementation is required.**

Using any libraries/databases etc create a simple account-based payment service with REST API.

This service will have basic endpoints:

1. Account Topup
```
/topup {
	"account_id": "",
	"amount": 123,
}
```
2. Account Withdraw
```
/withdraw {
	"account_id": "",
	"amount": 123
}
```
3. Transfer between account A and account B
```
/transfer {
	"from_id": "",
	"to_id": "",
	"amount": 123
}
```

The goal is to create a racing-condition-proof system that would prevent account being overdrafted by design.   

##Solution
<p>
So main idea - event based structure. Any transaction putted into queue for workers with some quick checks. After each item in queue must be processed.
So API is status requested. Means on first request getting results for "quick check" and ID, if success - needs to check status of ID to identify end transaction and final status (could be organized by webhooks or other ...)
</p>
For the best speed and structure control we should have Relation DB with table on transactions structure:
<code>
<pre>
id: UUID,
created_at: Date of creation,
updated_at: Date of submition,
from_account_id: ACCOUNT_ID,
to_account_id: ACCOUNT_ID,
status: Current status,
error: if no error == 0 (default is -1 - means first registrration & just request)
...
</pre>
</code>
<p>could be extended for future</p>

It doesn't mean that we should use only relation DB, it's only for transaction any account & customer data could(& in most cases - should) be in NoSQL DB, syncronized.
