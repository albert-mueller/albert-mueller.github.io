<?xml version="1.0" encoding="UTF-8"?>
<!--
  Browser view for the RSS feeds written by scripts/fetch-announcements.mjs
  (announcements.xml, discussions.xml, issues.xml). Without this, clicking the
  RSS icon shows raw XML. Feed readers ignore the stylesheet.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" encoding="UTF-8" indent="yes"
    doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title><xsl:value-of select="/rss/channel/title"/> (RSS)</title>
        <link rel="icon" href="/favicon.ico"/>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #ffffff; --bg-soft: #f6f6f7; --text: #213547; --muted: #67676c;
            --border: #e2e2e3; --brand: #3451b2; --brand-soft: rgba(100, 108, 255, .14);
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #1b1b1f; --bg-soft: #202127; --text: rgba(255, 255, 245, .86); --muted: rgba(235, 235, 245, .6);
              --border: #3c3f44; --brand: #a8b1ff; --brand-soft: rgba(100, 108, 255, .16);
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0; background: var(--bg); color: var(--text);
            font: 16px/1.6 Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          main { max-width: 760px; margin: 0 auto; padding: 32px 20px 64px; }
          a { color: var(--brand); text-decoration: none; }
          a:hover { text-decoration: underline; }
          .notice {
            background: var(--brand-soft); border-radius: 8px; padding: 16px 20px; margin-bottom: 32px;
          }
          .notice p { margin: 0 0 10px; }
          .notice p:last-child { margin-bottom: 0; }
          .feed-url {
            display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
          }
          .feed-url code {
            flex: 1 1 280px; min-width: 0; overflow-x: auto; white-space: nowrap;
            background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px;
            font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          }
          button {
            font: inherit; font-size: 14px; cursor: pointer; color: var(--text);
            background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px;
          }
          button:hover { border-color: var(--brand); }
          h1 { font-size: 28px; line-height: 1.3; margin: 0 0 8px; }
          .desc { color: var(--muted); margin: 0 0 8px; }
          .back { display: inline-block; margin-bottom: 24px; }
          article { border-top: 1px solid var(--border); padding: 20px 0; }
          article h2 { font-size: 19px; line-height: 1.4; margin: 0 0 4px; }
          .meta { color: var(--muted); font-size: 14px; margin: 0 0 8px; }
          article p.excerpt { margin: 0; }
          .empty { color: var(--muted); }
        </style>
      </head>
      <body>
        <main>
          <div class="notice">
            <p>
              <strong data-de="Das ist ein RSS-Feed.">This is an RSS feed.</strong>
              <xsl:text> </xsl:text>
              <span data-de="Kopiere die Adresse in deinen Feed-Reader (z. B. NetNewsWire, Feedly, Thunderbird), um neue Beiträge automatisch zu erhalten.">Copy the address into your feed reader (e.g. NetNewsWire, Feedly, Thunderbird) to get new posts automatically.</span>
            </p>
            <div class="feed-url">
              <code id="feed-url"><xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/></code>
              <button type="button" id="copy" data-de="Adresse kopieren">Copy address</button>
            </div>
          </div>

          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="desc"><xsl:value-of select="/rss/channel/description"/></p>
          <a class="back" href="{/rss/channel/link}" data-de="← Zur Website">← Back to the website</a>

          <xsl:choose>
            <xsl:when test="/rss/channel/item">
              <xsl:for-each select="/rss/channel/item">
                <article>
                  <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
                  <p class="meta">
                    <xsl:value-of select="substring(pubDate, 6, 11)"/>
                    <xsl:if test="dc:creator">
                      <xsl:text> · </xsl:text>
                      <xsl:value-of select="dc:creator"/>
                    </xsl:if>
                  </p>
                  <p class="excerpt"><xsl:value-of select="description"/></p>
                </article>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <p class="empty" data-de="Noch keine Einträge.">No entries yet.</p>
            </xsl:otherwise>
          </xsl:choose>
        </main>
        <script>
          (function () {
            var langs = navigator.languages || [navigator.language || ''];
            if (String(langs[0] || '').toLowerCase().indexOf('de') === 0) {
              document.documentElement.lang = 'de';
              var els = document.querySelectorAll('[data-de]');
              for (var i = 0; i !== els.length; i++) els[i].textContent = els[i].getAttribute('data-de');
              var back = document.querySelector('a.back');
              if (back) back.href = back.href.replace(/\.io\//, '.io/de/');
            }
            var btn = document.getElementById('copy');
            var url = document.getElementById('feed-url').textContent;
            btn.addEventListener('click', function () {
              var label = btn.textContent;
              var done = function () {
                btn.textContent = document.documentElement.lang === 'de' ? 'Kopiert ✓' : 'Copied ✓';
                setTimeout(function () { btn.textContent = label; }, 1500);
              };
              if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {});
            });
          })();
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
