{ import: st80 }
{ import: util }

ParentList : OrderedCollection ()

_object	   isParentList [ ^false ]
ParentList isParentList [ ^true  ]

_vtable addParent: aVtable
[
  delegate isNil
    ifTrue: [delegate := aVtable]
    ifFalse:
      [delegate isParentList
	ifTrue:  [delegate add: aVtable]
	ifFalse: [delegate := ParentList new
		    add: delegate;
		    add: aVtable;
		    yourself]]
]

ParentList lookup: messageName
[
  | method |
  self do: [:aVtable |
    (method := aVtable lookup: messageName) notNil
      ifTrue: [^method]].
  ^nil
]


C1 : Object ()
C1 m [ 'this is m' putln ]

C2 : Object ()
C2 n [ 'this is n' putln ]

C3 : C1 ()

[
  C3 _vtable addParent: C2 _vtable.
  C3 new
    m;
    n
]

