# Registros DNS para casavillar.site (Cloudflare)

Ve a **dash.cloudflare.com → casavillar.site → DNS → Records → Add record**

> Nota: usas Gmail personal — no envías correos desde @casavillar.site.
> La configuración bloquea CUALQUIER envío desde ese dominio, lo que es
> la opción más segura y elimina completamente el riesgo de suplantación.

---

## 1. SPF — bloquea todo envío desde casavillar.site

| Campo   | Valor |
|---------|-------|
| Type    | TXT |
| Name    | `@` |
| Content | `v=spf1 -all` |
| TTL     | Auto |
| Proxy   | **DNS only** (nube gris, NO proxied) |

> `-all` significa "ningún servidor está autorizado a enviar correos
> desde casavillar.site". Cualquier intento de suplantación falla directo.

---

## 2. DMARC — rechaza y reporta los correos falsos

| Campo   | Valor |
|---------|-------|
| Type    | TXT |
| Name    | `_dmarc` |
| Content | `v=DMARC1; p=reject; rua=mailto:casa.villarmp@gmail.com` |
| TTL     | Auto |
| Proxy   | **DNS only** (nube gris) |

> `p=reject` hace que los servidores de correo descarten directamente
> cualquier email que finja venir de @casavillar.site.
> Los reportes de intentos de fraude llegarán a tu Gmail.

---

## 3. DKIM — no aplica en tu caso

DKIM requiere Google Workspace (de pago). Como no envías correos desde
@casavillar.site, no necesitas DKIM. Con SPF `-all` y DMARC `p=reject`
el dominio queda completamente protegido contra suplantación.

---

## Verificar (espera 5-10 min después de guardar)

Entra a https://mxtoolbox.com/SuperTool.aspx y escribe `casavillar.site`
para confirmar que SPF y DMARC están activos.
