<%@ Page Inherits="FluentUITemplate.Default, FluentUITemplate" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="http://localhost/wfgen/wfapps/webforms/FLUENTUI_TEMPLATE/V1/build/favicon.png" />
    <meta name="theme-color" content="#000000" />
    <link rel="apple-touch-icon" href="http://localhost/wfgen/wfapps/webforms/FLUENTUI_TEMPLATE/V1/build/logo192.png" />
    <link rel="manifest" href="http://localhost/wfgen/wfapps/webforms/FLUENTUI_TEMPLATE/V1/build/manifest.json" />
    <script>
      if (window.CSS === undefined || !CSS.supports('color', 'var(--fake-var)')) window.location.replace('/unsupportedbrowser.html');
      function __fallbackScript(e) { window.location.replace(e.target.src); }
    </script>
    <title>WorkflowGen React</title>
    <script type="module" crossorigin="use-credentials" src="http://localhost/wfgen/wfapps/webforms/FLUENTUI_TEMPLATE/V1/build/assets/index-9XXEdCQQ.js"></script>
  </head>
  <style>
    :where(body) {
      --background-color: #ffffff;
      --text-color: #242424;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: var(--background-color);
      color: var(--text-color);
    }
    @media (prefers-color-scheme: dark) {
      :where(body) {
        --background-color: #292929;
        --text-color: #ffffff;
      }
    }
  </style>
  <body dir="ltr">
    <div id="root"></div>
    <form id="form1" runat="server"></form>
    <script>
      if (location.protocol === 'file:') {
        document.forms[0].submit();
      }
      else {
        const scriptTags = document.getElementsByTagName('script');
        for (let scriptTag of scriptTags) scriptTag.addEventListener("error", __fallbackScript);
      }
    </script>
  </body>
</html>
