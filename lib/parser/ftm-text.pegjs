start
  = (pattern / array / property / comment)+

pattern
  = p:(('PATTERN' SPACE+ n:number NEWLINE){ return n; }) a:array+
  { return { type: 'pattern', rows: a }; }

property
  = p:propertyName (SPACE+ ':')? SPACE+ v:valueList EOL
  { return { name: p, values: v } }

propertyName
  = chars:propertyChar+
  { return chars.join(''); }

array
  = p:propertyName SPACE+ i:number SPACE+ ':' SPACE+ head:valueListItem* last:value SPACE* EOL
  { return { name: p, index: i, values: head.concat([last]) } }

valueList
  = head:valueListItem* last:value?
  { return { values: head.concat([last]) } }

valueListItem
  = v:value SPACE+
  { return v; }

value
  = v:(empty / stop / noise / note / number / quotedText / unbrokenText)
  {
    return v;
  }

stop "Stop"
  = '---'
  { return { type: 'stop' } }

note "Note"
  = n:([a-gA-G][#-][0-9])
  { return { type: 'note', value: n.join('') }; }

noise "Noise"
  = n:([a-gA-G0-9][-][-#])
  { return { type: 'noise', value: n.join('') }; }

empty
  = '.'+
  { return ''; }

comment
  = _ '#' _ text:text EOL
  { return { comment: text }; }

textLine "line of text"
  = t:text EOL
  { return t; }

quotedText
  = openQuote t:[^"]* closeQuote
  { return t.join(''); }

openQuote "Open Quote"
  = '"'

closeQuote "Close Quote"
  = '"'

unbrokenText
  = chars:noSpace+
  { return chars.join(''); }

noSpace "Not a space"
  = [^ \n]

text
  = chars:anyChar+
  { return chars.join(''); }

propertyChar "Property Char"
  = [A-Z0-9]

anyChar "Char"
  = [^\n]

blankLine
  = '\n'
  {}

SPACE "space"
  = whitespace+

_ "whitespace"
  = whitespace*

number "Hex number"
  = n:('-'?digits+)
  { return parseInt(n.join(''), 10); }

digits "Hex digit"
  = n:[0-9a-fA-F]+
  { return  parseInt(n.join(''), 16); }

whitespace "Whitespace"
  = [ \t]

EOL "End of line or file"
  = (EOF / NEWLINE*)

NEWLINE "Newline"
  = '\n'

EOF "End of file"
  = !.
