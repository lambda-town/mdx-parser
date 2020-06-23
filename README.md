# Mdx Parser

## Start the server

```
yarn start
```

The default port is `4545`

## Parse a complete MDX File

```
POST /
```

With MDX Contents as body

## Retrieve only MDX blocks with specific names

```
POST /elements
```

With MDX Contents as body and the `names` query parameter specifying with elements to include
in the response, e.g.

```
curl --request POST \
  --url 'http://localhost:4545/elements?names=Question&names=ScalaCode' \
  --data 'You MDX File'
```

This will return something like this

```
[
  {
    "type": "mdxBlockElement",
    "name": "ScalaCode",
    "attributes": [
      {
        "type": "mdxAttribute",
        "name": "id",
        "value": "hello-world-1"
      }
    ]
  }
]
```

