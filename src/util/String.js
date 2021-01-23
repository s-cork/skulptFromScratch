import {Unicode} from "./unicode";

const {Lu, Ll, Lt, Lm, Lo, Nl, Mn, Mc, Nd, Pc } = Unicode;
const the_underscore = "_";
const Other_ID_Start = '\\u1885-\\u1886\\u2118\\u212E\\u309B-\\u309C';
const Other_ID_Continue = '\\u00B7\\u0387\\u1369-\\u1371\\u19DA';
const id_start = Lu + Ll + Lt + Lm + Lo + Nl + the_underscore + Other_ID_Start;
const id_continue = id_start +  Mn +  Mc +  Nd +  Pc +  Other_ID_Continue;

const IS_IDENTIFIER_REGEX = new RegExp('^([' + id_start + '])+([' + id_continue + '])*$');

String.prototype.isIdentifier = function () {
    return IS_IDENTIFIER_REGEX.test(this.normalize('NFKC'));
}

const IS_SPACE = /^\s+$/;
String.prototype.isSpace = function() {
    return IS_SPACE.test(this);
}