(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("artis", function(config, parserConf) {
    function wordRegexp(words, end) {
      if (typeof end === "undefined") { end = "\\b"; }
      return new RegExp("^((" + words.join(")|(") + "))" + end);
    }

    var operators = wordRegexp([
      "[<>]:", "[<>=]=", "<<=?", "=>", "->", "[\\%*+\\-<>!=\\/^|&]=?", "\\?", "\\\\", "\\$", "~", ":", "\\b(in|out)"
    ], "");
    var delimiters = /^[;,()[\]{}]/;
    var variable = /^[_A-Za-z]*!*/;
    var string = /^(['"][A-Za-z]*['"]*)/;
    var keywords = wordRegexp(["var", "if", "else", "else if", "while", "for",
      "let", "do", "return", "break", "const", "import", "function", "module", "struct", "type"]);
    var booleans = wordRegexp(["true", "false"]);

    //ARTIS REGEX
    var sectionName = wordRegexp(["name"]);
    var atomicWords = ["parameters", "state", "in_ports", "out_ports", "init", "delta_int", "delta_ext", "delta_conf", "ta", "output"]
    var atomic = wordRegexp(atomicWords);
    var domains = wordRegexp(["< R >", "< R- >", "< R\\+ >", "< R\\* >", "< R\\+\\* >", "< R-\\* >", "< N >","< Z >", "< C >", "< Q >"], '');
    var phase = wordRegexp(["passive", "busy"]);


    function tokenBase(stream, state) {

      //Commentaires sur plusieurs lignes
      if (stream.match(/^#=/, false)) {
        state.tokenize = tokenComment;
        return state.tokenize(stream, state);
      }

      if (stream.match(/^lit\("[A-Za-z1-9]*"\)/gi)) {
        var keyword = stream.current().match(/"(.*)"/).pop();
        atomicWords.push(keyword);
        atomic = wordRegexp(atomicWords);
        return "artis-new-lit";
      }

      if (stream.match(/^lexeme\("[A-Za-z1-9]*"\)/gi)) {
        var keyword = stream.current().match(/"(.*)"/).pop();
        atomicWords.push(keyword);
        atomic = wordRegexp(atomicWords);
        return "artis-new-lit";
      }

      if (stream.match(domains)) {
        return "artis-domains";
      }

      if (stream.match(phase)) {
        return "artis-phase";
      }

      if (stream.match(atomic)) {
        return "artis-atomic-models";
      }

      if (stream.match(sectionName)) {
        return "artis-section-name";
      }

      //Erreur si plus de 3 points d'affilee
      if (stream.match(/\.{3,}/)) {
        return "error";
      }

      if (stream.eatSpace()) {
        return null;
      }

      var ch = stream.peek();
      if (ch === '#') {
        stream.skipToEnd();
        return "comment";
      }

      if (ch === '[') {
        state.scopes.push('[');
      }

      if (ch === '(') {
        state.scopes.push('(');
      }

      if (stream.match(operators)) {
        return "operator";
      }

      //Valeurs numeriques
      if (stream.match(/^\.?\d/, false)) {
        if (stream.match(/^\d*\.(?!\.)\d*([Eef][\+\-]?\d+)?/i)) { return "number"; }
        if (stream.match(/^[1-9]\d*(e[\+\-]?\d+)?/)) { return "number";  }
        if (stream.match(/^0(?![\dx])/i)) { return "number"; }
      }

      if (stream.match(string)) {
        return "string";
      }

      if (stream.match(delimiters)) {
        return null;
      }

      if (stream.match(keywords)) {
        return "keyword";
      }

      if (stream.match(booleans)) {
        return "builtin";
      }

      if (stream.match(variable)) {
        return "variable";
      }

      stream.next();
      return "error";
    }

    function tokenComment(stream, state) {
      if (stream.match(/^#=/)) {
        state.nestedLevels++;
      }
      if (!stream.match(/.*?(?=(#=|=#))/)) {
        stream.skipToEnd();
      }
      if (stream.match(/^=#/)) {
        state.nestedLevels--;
        if (state.nestedLevels == 0) {
          state.tokenize = tokenBase;
        }
      }
      return "comment";
    }

    return {
      startState: function() {
        return {
          tokenize: tokenBase,
          scopes: [],
          nestedLevels: 0
        };
      },

      token: function(stream, state) {
        var style = state.tokenize(stream, state);

        return style;
      },

      indent: function(state, textAfter) {
        var delta = 0;
        if ( textAfter === ']' || textAfter === ')' || textAfter === "end" ||
          textAfter === "else" || textAfter === "catch" || textAfter === "elseif" ||
          textAfter === "finally" ) {
          delta = -1;
        }
        return (state.scopes.length + delta) * config.indentUnit;
      },

      blockCommentStart: "#=",
      blockCommentEnd: "=#",
      lineComment: "#"
    };
  });

});
