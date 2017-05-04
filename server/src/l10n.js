// NOTE: this file is very WIP

const fs = require("fs");
const path = require("path");

const accepts = require("accepts");
const globby = require("globby");
require("fluent-intl-polyfill/compat");
const { MessageContext } = require("fluent/compat");
const parseFTL = require("fluent")._parse;
const negotiateLanguages = require("fluent-langneg/compat");

// ideal API:
// 1) gettext usage
// 2) passing strings to fluent-react
// const _ = require("./l10n").getText;
//
// let msg = _('download_message'); // "Please download"

// but why do the same fluent-react init in 10 different pages?
// just do it once, here, and export a ready LocalizationProvider.
// aha. we'll put it inside reactruntime.
// - the fully primed LocalizationProvider wraps the whole app
// - add the gettext function to a spot where models and views can find it...









// 1. at startup time, grab all the strings.
const STRINGS = getStrings();


// Returns a Promise that resolves to an object
// If you just want specific locales, pass in an array: getStrings(['en-US', 'en-GB'])
// If you want all the locales, don't pass in anything: getStrings()
function getStrings(locales) {
  return new Promise((resolve, reject) => {
    const LOCALES_CFG = path.normalize("../../locales"); // TODO get this from config somehow before landing
    const LOCALES_DIR = path.join(process.cwd(), LOCALES_CFG);
    // Note: we assume there is just one ftl file, named "server.ftl".
    const localesGlob = LOCALES_DIR + "/*/server.ftl";
    const MESSAGES = {};

    globby(localesGlob).then(paths => {
      if (!paths.length) { reject(`No ftl files found at ${localesGlob}. Giving up`); }
      paths.forEach(path => {
        // now paths is like [ '/path/to/screenshots/locales/en-US/server.ftl' ]
        // so we want to break it into pieces, get the next-to-last one, and use that as the key:
        locale = path.split('/').slice(-2, -1);
        if (locales && !locales.includes(locale)) { return; }
        let contents = fs.readFileSync(path, 'utf-8');
        if (!contents) {
          return console.error(`failed to open ${locale} ftl file: `, err);
        }
        parsed = parseFTL(contents);
        if (parsed[1].length) {
          // TODO: something threw errors when parsing. log to console? bail?
          // let's try this just for the moment: log errors but don't bail
          parsed[1].forEach(error => console.error(error));
        }
        MESSAGES[locale] = parsed[0];
      });
      resolve(MESSAGES);
    }).catch(reject);
  });
}

let messageContext;

// TODO: figure out why we have to use generators here. seems unnecessary
function generateMessages(userLocales) {
  const currentLocales = negotiateLanguages(
    userLocales,
    ['en-US'],
    { defaultLocale: 'en-US' }
  );

  // TODO: trying to just return a promise instead of a generator, to skirt around babel errors
  return getStrings(currentLocales).then(strings => {
    messageContext = new MessageContext();
    currentLocales.forEach(locale => {
      messageContext.addMessages(strings[locale]);
    });
    return messageContext;
  }, err => { throw err });
}

function init(locales) {
  const userLocales = locales || ["en-US"];
  
  // TODO: remove dupliation with generateMessages
  const currentLocales = negotiateLanguages(
    userLocales,
    ["en-US"],
    { defaultLocale: "en-US" }
  );

  // NOTE: implicit global assignment. (TODO should this just be a constructor?)
  messageContext = new MessageContext();
  getStrings(currentLocales).then(strings => {
    strings.forEach(lang => { messageContext.addMessages(lang) });
  });
}

// pass in the l10n-id as the first argument, and key-values as
// a second argument:
//
// If the message is "welcome = Hello, {user}"
// then the correct call would be: 
//   getText('welcome', {user: 'firefox user'});
//
function getText(l10nID, opts) {
  // TODO: I think this is all wrong. Try again.
  // 1. figure out what the locales are: use navigator.languages or Accept-Languages header.
  //    - use the accepts library: accepts(req).languages
  
  // 2. get a MessageContext with the right locales.
  // 3. then return ctx.format(ctx.messages.get(l10nID), opts);
  if (typeof messageContext === "undefined") {
    throw new Error('must init before calling getText');
  }
  let msg = messageContext.messages.get(l10nID);
  if (!msg) {
    throw new Error(`unable to find translation for l10n ID ${l10nID}`);
  }
  return messageContext.format(msg, opts);
}

module.exports = { generateMessages, getStrings, getText, init }
