# Registros DNS para casavillar.site (Cloudflare)

Ve a **dash.cloudflare.com → casavillar.site → DNS → Records → Add record**

---

## 1. SPF — evita suplantación de correo

| Campo  | Valor |
|--------|-------|
| Type   | TXT |
| Name   | `@` |
| Content | `v=spf1 include:_spf.google.com ~all` |
| TTL    | Auto |
| Proxy  | **DNS only** (nube gris, NO proxied) |

> Si usas otro proveedor de correo reemplaza `include:_spf.google.com`:
> - Zoho: `include:zoho.com`
> - Microsoft 365: `include:spf.protection.outlook.com`
> - Otro: consulta la documentación de tu proveedor

---

## 2. DMARC — qué hacer con correos falsos

| Campo  | Valor |
|--------|-------|
| Type   | TXT |
| Name   | `_dmarc` |
| Content | `v=DMARC1; p=quarantine; rua=mailto:dmarc@casavillar.site; pct=100` |
| TTL    | Auto |
| Proxy  | **DNS only** (nube gris) |

> `p=quarantine` manda los correos falsos al spam de tus clientes.
> Cuando confirmes que tu correo legítimo llega bien, cambia a `p=reject`.

---

## 3. DKIM — firma criptográfica (configura desde tu proveedor de correo)

DKIM se activa en el panel de tu proveedor de correo, que te genera el registro:

- **Google Workspace**: Admin console → Apps → Google Workspace → Gmail → Authenticate email
- **Microsoft 365**: Admin center → Exchange → Protection → DKIM
- **Zoho Mail**: Settings → Email Domains → SPF/DKIM Authentication

El panel te dará un registro TXT tipo:
```
Name:    google._domainkey
Content: v=DKIM1; k=rsa; p=MIIBIjAN...
```
Agrégalo en Cloudflare DNS con **Proxy: DNS only**.

---

## Verificar (espera 5-10 min después de guardar)

- SPF + DMARC: https://mxtoolbox.com/SuperTool.aspx
- DKIM: https://mxtoolbox.com/dkim.aspx
