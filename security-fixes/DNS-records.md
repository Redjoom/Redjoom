# Registros DNS requeridos para casavillar.site

Agrega estos 2 registros TXT en el panel de tu proveedor de DNS
(Namecheap, GoDaddy, Cloudflare, etc.)

---

## 1. SPF — evita que otros envíen correos suplantando tu dominio

| Campo | Valor |
|-------|-------|
| Tipo  | TXT |
| Nombre / Host | `@` (o `casavillar.site.`) |
| Valor | `v=spf1 include:_spf.google.com ~all` |
| TTL   | 3600 |

> Si usas otro proveedor de correo (Zoho, Outlook, etc.), reemplaza
> `include:_spf.google.com` con el valor que te indique tu proveedor.

---

## 2. DMARC — define qué hacer con los correos falsos

| Campo | Valor |
|-------|-------|
| Tipo  | TXT |
| Nombre / Host | `_dmarc` (resulta en `_dmarc.casavillar.site`) |
| Valor | `v=DMARC1; p=quarantine; rua=mailto:dmarc@casavillar.site; pct=100` |
| TTL   | 3600 |

> `p=quarantine` manda al spam los correos falsos.
> Cambia a `p=reject` cuando estés seguro de que tu correo legítimo funciona.

---

## 3. DKIM — firma criptográfica de tus correos (configura en tu proveedor de correo)

DKIM se configura desde el panel de tu proveedor de correo, no desde DNS directamente:

- **Google Workspace**: Admin > Apps > Google Workspace > Gmail > Autenticar correo electrónico
- **Microsoft 365**: Centro de administración > Exchange > Protección > DKIM
- **Zoho Mail**: Configuración > Dominios de correo > Autenticación SPF/DKIM

El panel te generará el registro TXT que debes agregar a tu DNS.

---

## Verificar que funciona (después de 24-48h)

Puedes verificar tus registros en:
- SPF + DMARC: https://mxtoolbox.com/SuperTool.aspx
- DKIM: https://mxtoolbox.com/dkim.aspx
