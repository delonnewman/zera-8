{ import: st80 }
{ import: util }

_vtable get [ ^_closure data ]

s_get	    := [_selector _intern: 'get'       _stringValue]
s___proto__ := [_selector _intern: '__proto__' _stringValue]

get := [(_vtable _vtable lookup: s_get) value _method]

Object set: prop to: val
[
  | sel closure |
  sel := _selector _intern: prop _stringValue. 
  (closure := self _vtable lookup: sel) notNil
    ifFalse:
      [closure := self _vtable methodAt: sel put: get with: nil].
  closure setData: val.
  sel == s___proto__
    ifTrue:
      [self _vtable delegate: val _vtable.
       _vtable flush].
]


X : Object ()
Y : Object ()
Z : Object ()

[
  X set: 'foo' to: 5.
  Y set: 'bar' to: 1234.
  X foo println.
  Y bar println.
  X set: '__proto__' to: Y.
  X bar println.
]

