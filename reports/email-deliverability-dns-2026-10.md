# DNS Change Log: jasminaziz.co.uk, DMARC reporting address

**Date of change:** Thursday 8 October 2026, 19:51:22 UTC (20:51 BST)
**Changed by:** Claude Code session, through GoDaddy's `gddy` CLI (v0.2.25), authenticated by Jasmin through GoDaddy OAuth
**Scope of change:** one record, TXT `_dmarc`. Nothing else in the zone was touched.
**Status:** uncommitted, awaiting Jasmin's read.

Every DNS value below is already public in DNS. No API key, secret or token appears in this file.

---

## 1. Why

DMARC aggregate reports were going to `dmarc_rua@onsecureserver.net`, a GoDaddy-run address, so no report had ever reached Jasmin. The policy cannot safely move from `p=none` to `p=quarantine` until reports are being read. This change sends reports to a free Postmark weekly digest instead. The policy stays at `none`.

---

## 2. Before-snapshot

Read through the GoDaddy API (`gddy dns list`) at 19:23 UTC on 8 October 2026, 20 records. It matched public DNS from 8.8.8.8, 1.1.1.1 and ns11.domaincontrol.com record for record, read at 19:20 UTC.

```
A      @                          3600  76.76.21.21
A      ops                        600   76.76.21.21
NS     @                          3600  ns11.domaincontrol.com.
NS     @                          3600  ns12.domaincontrol.com.
CNAME  www                        3600  cname.vercel-dns.com.
SOA    @                          3600  (GoDaddy-managed)
MX     @                          3600  1  aspmx.l.google.com.
MX     @                          3600  5  alt1.aspmx.l.google.com.
MX     @                          3600  5  alt2.aspmx.l.google.com.
MX     @                          3600  10 alt3.aspmx.l.google.com.
MX     @                          3600  10 alt4.aspmx.l.google.com.
MX     send                       3600  10 feedback-smtp.eu-west-1.amazonses.com.
TXT    @                          3600  google-site-verification=7kMr66pA9vEFbWcvsmHxjY4w8HzxH1zJ2ZoZsjbf-Co
TXT    @                          3600  v=spf1 include:dc-aa8e722993._spfm.jasminaziz.co.uk ~all
TXT    dc-aa8e722993._spfm        3600  v=spf1 include:_spf.google.com ~all
TXT    dc-fd741b8612._spfm.send   3600  v=spf1 include:amazonses.com ~all
TXT    google._domainkey          3600  v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn+RU+iCAlWDqKfTChUHFprgMaPf8UgWhRhgzOHBL4WVkk4n5wItKt0KbZ4Bm04XFxDzfVvFTz8aqih8e6gPpgK9+7qV/LjI0cJaNPN/JZo1k5aX/4WU4W7PYRIL2FYWVMr81gjTtqR6TBXcTQmVAx3XyU5J3yALdGEC9+ckM36FKpai4QoqYyUJPuksAoJSDmZxoV/xdg7/mRSM3VupUYgKT+6Cdi/MO9y85x0Wk65i9RiV/+3YeMI+f3HFy6jeFioCFJsMg+2OqCYchaSJ2ZLtGt04k86McZAJ3FzxXw+ZUTj3UituYUxJfG6F0E0My16HHSVaw7mqx4R3S8KLwpwIDAQAB
TXT    resend._domainkey          3600  p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCc+aTHYct65ywqmYwc6Z9/f+BZ3lRoHViokihC0H6tcf3HAX9FXtHZiRR/A3IBAefHykSKjhXSm8MV4blCO7vEW5LRCGUB23A6afX4pgZ4PH5UCaYPeO+BI0vLmmNT629o7CorarMFncwn9ikQCfU4DqCJCRvG/jtwrePOnBtZuwIDAQAB
TXT    send                       3600  v=spf1 include:dc-fd741b8612._spfm.send.jasminaziz.co.uk ~all
TXT    _dmarc                     3600  v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;
```

MX priorities are from dig. The API listing returned the MX records without them.

### Differences from the 7 October audit baseline

- **`send.` SPF.** The baseline described it as an amazonses SPF record. It is a GoDaddy-managed `_spfm` include (`include:dc-fd741b8612._spfm.send.jasminaziz.co.uk`), which resolves to `v=spf1 include:amazonses.com ~all`. Same effect, one extra lookup, and the same managed pattern as the root SPF.
- **Web records.** Apex A, `ops` A and the `www` CNAME are present. They are not mail records and the baseline did not cover them. They were not touched.
- Everything else matched: NS, the five Google MX records, root SPF and the verification token, both DKIM keys, the `send.` MX, and `_dmarc`.

---

## 3. The change

| | |
|---|---|
| Record | TXT `_dmarc.jasminaziz.co.uk`, TTL 3600 |
| Before | `v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` |
| After | `v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;` |
| Changed | the `rua` address only. Policy and alignment are unchanged. |

**Command (narrowest available).** It replaces records of type TXT named `_dmarc` only. There was exactly one. TXT `@` was never written to.

```
gddy dns set jasminaziz.co.uk --type TXT --name _dmarc \
  --data "v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;" \
  --ttl 3600
```

**Dry-run first.** The plan was `replace: 1, created: 0, deleted: 0` against a single record. Jasmin approved it before the change was applied.

**Result:** `"action": "set", "replaced": 1, "created": 0, "deleted": 0`, exit 0.

**Reporting address authorised.** Because reports go to another domain, receivers check for an authorisation record on Postmark's side before sending. That record is present:

```
jasminaziz.co.uk._report._dmarc.inbound.dmarcdigests.com. 3600 IN TXT "v=DMARC1;"   (8.8.8.8 and 1.1.1.1)
inbound.dmarcdigests.com. IN MX 10 inbound.postmarkapp.com.
```

**Rollback.** If needed, run the same command with the before-value.

---

## 4. After-state

### API view: whole zone diffed against the before-snapshot

Read at 19:51 UTC, straight after the change. Both sides were non-empty: 20 records before and 20 after. Record IDs were ignored in the comparison.

```
REMOVED:
   {"data": "v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;", "name": "_dmarc", "ttl": 3600, "type": "TXT"}
ADDED:
   {"data": "v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;", "name": "_dmarc", "ttl": 3600, "type": "TXT"}
```

No other record changed.

### Authoritative nameservers

At 19:51:35 UTC, 13 seconds after the change, ns11 and ns12 still served the old value. Both were serving the new value by 19:52:13 UTC:

```
ns11: "v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;"
ns12: "v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;"
```

### Public resolvers (8.8.8.8 and 1.1.1.1)

At 19:51:35 UTC both still returned the old value. Both were serving the new one by 19:54:34 UTC, about three minutes after the change. The final read was taken across all four servers and the API together:

```
# read 2026-10-08 19:54:41 UTC
## dig @8.8.8.8 TXT _dmarc.jasminaziz.co.uk
_dmarc.jasminaziz.co.uk. 3600	IN	TXT	"v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;"
## dig @1.1.1.1 TXT _dmarc.jasminaziz.co.uk
_dmarc.jasminaziz.co.uk. 3600	IN	TXT	"v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;"
## dig @ns11.domaincontrol.com TXT _dmarc.jasminaziz.co.uk
_dmarc.jasminaziz.co.uk. 3600	IN	TXT	"v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;"
## dig @ns12.domaincontrol.com TXT _dmarc.jasminaziz.co.uk
_dmarc.jasminaziz.co.uk. 3600	IN	TXT	"v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;"
## API (gddy dns list): 20 records
TXT _dmarc 3600 v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:re+86dc33d29129@inbound.dmarcdigests.com;
```

Mail-provider resolvers cache on the same one-hour TTL, so every receiver will be using the new address by 20:52 UTC at the latest.

---

## 5. Does GoDaddy manage DMARC through an account feature?

**Not established. Nothing was switched off.**

- The GoDaddy API has no DMARC, SPF or DKIM commands. The domain record (`gddy domain get`) shows no email-authentication setting, and its `updatedAt` is 24 April 2026, the registration date. The API cannot show whether such a feature is on.
- Circumstantial signs that GoDaddy tooling wrote the email records: both SPF records are GoDaddy-generated `dc-…._spfm` includes, and the old report address was on `onsecureserver.net`, a GoDaddy-run domain. This is inference from naming, not verified.
- If such a feature is on, it could rewrite `_dmarc` and remove the Postmark address. It could also explain the June quarantine sliding back to none by September. Nothing found here confirms either.
- **To settle it:** check in the GoDaddy dashboard, under the domain's DNS settings and any Email or email-authentication product, for a DMARC option that is switched on. Alternatively, a session could log in with the extra read-only scope `email.mailbox:read` to see whether the account holds a GoDaddy email product.

---

## 6. Dates

- **Postmark first digest:** expected within about a week. Receivers send aggregate reports roughly daily, and Postmark summarises them weekly.
- **Re-read `_dmarc`** on 15 October with the first digest. If the `rua` has changed back, something on the account is rewriting it (see section 5).
- **Quarantine step due: Thursday 22 October 2026**, the earliest date. It is two weeks after the change went live, and it is conditional on two clean weekly digests having arrived. If the second digest lands later than 22 October, the step falls due the day it lands, not before.
- The quarantine step is out of scope for this log: it changes `p=none` to `p=quarantine` in the same record, with the same command.
