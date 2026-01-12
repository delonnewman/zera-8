{ import: st80 }
{ import: util }

Trait : Object ()

Object useTrait: aTrait [ aTrait addTo: self ]

Trait addTo: anObject
[
  self _vtable keysAndValuesDo: [:selector :closure |
    | newClosure |
    newClosure := anObject _vtable traitMethodAt: selector put: closure _method.
    newClosure setData: closure data]
]

_vtable traitMethodAt: aSelector put: aMethod
[
  (self includesKey: aSelector)
    ifTrue: [^self errorConflict: aSelector].
  ^self methodAt: aSelector put: aMethod with: 0
]

Trait + aTrait [ ^Trait _delegated useTrait: self; useTrait: aTrait ]


T1 : Trait ()
T1 m [ 'this is m' putln ]

T2 : Trait ()
T2 n [ 'this is n' putln ]

C : Object ()
[ C useTrait: T1 + T2 ]

C o [ self m; n ]

[
  C new o
]

