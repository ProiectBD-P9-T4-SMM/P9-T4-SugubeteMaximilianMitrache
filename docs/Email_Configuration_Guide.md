# Ghid de Configurare a Serviciului de Email (AFSMS)

Platforma AFSMS utilizează o arhitectură flexibilă pentru trimiterea de emailuri (notificări de masă, tichete de suport), permițând comutarea ușoară între diferite servicii prin intermediul fișierului `.env`.

Acest document detaliază cele trei moduri de configurare disponibile:

1.  **Mock (Ethereal)** - Modul implicit, pentru dezvoltare și testare.
2.  **Microsoft Graph API** - Modul de producție, obligatoriu conform specificațiilor pentru trimiterea in masa.
3.  **SMTP (Nodemailer)** - Modul de fallback (legacy) pentru servere de mail clasice.

---

## Modul 1: Mock (Ethereal) - Pentru Dezvoltare

Acesta este modul implicit. Este conceput pentru a testa logica de trimitere a emailurilor fără a trimite efectiv mesaje către căsuțe de email reale, evitând astfel spam-ul accidental în timpul dezvoltării.

**Cum funcționează:**
Creează automat un cont de test temporar (Ethereal) la pornirea serverului. Toate emailurile sunt "trimise" către acest cont, iar în consola de backend este generat un URL de unde poți vizualiza cum arată emailul.

**Configurare în `.env`:**
```env
EMAIL_PROVIDER=mock
```

**Validare / Testare:**
1.  Asigură-te că `EMAIL_PROVIDER=mock` este setat.
2.  Trimite un mesaj din aplicație (ex: formularul de Contact).
3.  Urmărește terminalul unde rulează backend-ul (`npm run dev`). Vei vedea un mesaj de forma:
    `[MockEmail] Message sent. Preview URL: https://ethereal.email/message/...`
4.  Dă click pe link pentru a vedea emailul.

---

## Modul 2: Microsoft Graph API - Pentru Producție (Recomandat)

Acest mod folosește API-ul oficial Microsoft Graph. Este soluția recomandată și cerută prin specificații pentru gestionarea trimiterilor de masă (bulk emails) către grupuri de studenți, deoarece respectă limitele și politicile de securitate ale ecosistemului Microsoft (folosit uzual în universități). 

Mecanismul de bulk utilizează endpoint-ul `$batch` din Graph API, trimițând cereri grupate (câte 20, limita Microsoft), asigurând livrarea individuală a mesajelor și prevenind expunerea adreselor (BCC implicit).

**Cerințe (Azure AD):**
Pentru a folosi acest mod, administratorul IT al universității trebuie să înregistreze o aplicație (App Registration) în Azure Active Directory (Entra ID) și să îi acorde permisiunea de tip *Application* (nu Delegated): `Mail.Send`.

**Configurare în `.env`:**
```env
EMAIL_PROVIDER=graph

# Datele de conectare Azure AD
GRAPH_TENANT_ID=id-ul-tenant-ului-azure        # ex: 1234abcd-12ab-34cd-56ef-1234567890ab
GRAPH_CLIENT_ID=id-ul-aplicatiei-inregistrate  # ex: 0987zyxw-98zy-76xw-54vu-0987654321zy
GRAPH_CLIENT_SECRET=secretul-aplicatiei        # ex: abcdefg_1234567890_hijklmnop

# Adresa de pe care se vor expedia emailurile (trebuie sa apartina tenant-ului)
GRAPH_SENDER_EMAIL=secretariat@ucv.ro
```

**Validare / Testare:**
1.  Setează `EMAIL_PROVIDER=graph` și completează datele `GRAPH_*`.
2.  Dacă datele lipsesc sau sunt incorecte, backend-ul va arunca o eroare la încercarea de trimitere: `[GraphEmail] Missing required env vars...` sau o eroare de autentificare Azure.
3.  La o trimitere reușită, în terminal va apărea: `[GraphEmail] Email sent to X recipients via Graph API`.

---

## Modul 3: SMTP Clasic - Mod de Fallback

Acest mod permite utilizarea oricărui server de email clasic (inclusiv servere SMTP on-premise sau alte servicii precum SendGrid, Mailgun) prin intermediul protocolului SMTP.

**Configurare în `.env`:**
```env
EMAIL_PROVIDER=smtp

# Configurarea serverului SMTP
SMTP_HOST=smtp.office365.com     # sau smtp.gmail.com, mail.domeniu.ro, etc.
SMTP_PORT=587                    # Portul (de obicei 587 pt TLS sau 465 pt SSL)
SMTP_SECURE=false                # true pt portul 465, false pt 587
SMTP_USER=adresa@ucv.ro          # User-ul de autentificare
SMTP_PASS=parola_contului        # Parola (sau app password)
```

**Validare / Testare:**
1.  Setează `EMAIL_PROVIDER=smtp` și completează datele `SMTP_*`.
2.  La o trimitere reușită, în terminal va apărea: `[SMTPEmail] Message sent: <id-mesaj>`.

---

## Diagnosticare

Pentru a verifica rapid ce mod este activ în acest moment în aplicație, există un endpoint dedicat:

*   **Ruta:** `GET /api/notifications/provider`
*   **Permisiuni:** Doar utilizatorii cu rol de `ADMIN`.
*   **Răspuns (JSON):**
    ```json
    {
      "provider": "Microsoft Graph API",
      "configured": true
    }
    ```
