# Sincronizzazione LinkedIn

Il portfolio legge gli aggiornamenti da `data/linkedin-posts.json`.

## Opzione semplice

Quando pubblichi un post su LinkedIn, aggiungi un oggetto al file:

```json
{
  "date": "2026-06-27",
  "title": "Titolo del post",
  "summary": "Sintesi breve orientata a recruiter e hiring manager.",
  "tags": [".NET", "Blazor", "RPA"],
  "url": "https://www.linkedin.com/feed/update/..."
}
```

## Opzione automatica

LinkedIn non espone un feed pubblico affidabile per i post personali. Per pubblicare anche qui in automatico serve uno di questi ponti:

- Make/Zapier: trigger su nuovo post LinkedIn, poi aggiornamento di `data/linkedin-posts.json` nel repository GitHub.
- LinkedIn API: richiede una app LinkedIn autorizzata e permessi validi per leggere i contenuti del profilo.
- Workflow semi-automatico: form o script locale che riceve URL, titolo e testo, aggiorna il JSON e fa commit.

La parte frontend e' gia' pronta: appena il JSON cambia, la sezione "LinkedIn live" mostra i nuovi aggiornamenti.
