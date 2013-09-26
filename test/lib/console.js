define(function () {
  QUnit.log(function log (details) {
    if (log.lastGroup !== details.module) {
      log.lastGroup && console.groupEnd();
      details.module && console.group(details.module);
      log.lastGroup = details.module;
    }

    if (details.result) {
      console.groupCollapsed(
        '%c %c %s ',
        'background: #2DC263; color: white;',
        'background: transparent; color: #999; font-weight: normal;',
        details.name);
      console.log(
        '\n%cSuccess: %c%s\n',
        'color: #2DC263; font-weight: bold;',
        'color: #666;',
        details.message
      );
      console.groupEnd();
    }
    else {
      console.group('%c %s ', 'background: #EE5757; color: white', details.name);
      console.log(
        '\n%cFail: %c%s%c expected%s%c%s%c%s \n\n%cSource: %c%s\n',
        'color: #BB3E3E; font-weight: bold;',
        'color: #27A554; font-weight: bold;',
        (details.expected !== undefined ? details.expected.toString() : 'true value'),
        'color: #666;',
        (details.actual !== undefined ? ', ' : ''),
        'color: #BB3E3E; font-weight: bold;',
        (details.actual !== undefined ? details.actual.toString() : ''),
        'color: #666;',
        (details.actual !== undefined ? ' returned.' : '.'),
        'color: #BB3E3E; font-weight: bold;',
        'color: #666;',
        details.source.trim()
      );
      console.groupEnd();
    }
  });
  return QUnit;
});