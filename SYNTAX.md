# Syntax

## Classes

```ruby
class Person
  @name : required
  @age  : default = UnknownAge

  def greet(language)
    "#{language.salutation} #{name}"
  end
end

class English
  def salutation
    "Hello"
  end
end
```

## Methods

Must be defined as part of a class or object, `self` is the object,
instance scope, lexical scope, asynchronous, mutable variables.

```ruby
object = Object.new
def object.hello
  "Hello"
end
```

## Functions

A single expression, `self` is the function, lexical scope, tail calls,
no mutation.

```ruby
def add1(x) = x + 1
```

## Procedures

Multiple statements, `self` is the procedure, lexical scope, tail calls,
`return`, `rescue`, `finally`, etc. available, mutable variables.

```ruby
def init_system(time)
  ...
end
```
