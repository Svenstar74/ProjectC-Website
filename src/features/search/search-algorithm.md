# Climate Concept Search Algorithm

1. **Normalize and Tokenize Query**
   - query to lowercase
   - split by underscores and whitespaces

2. **Filter Climate Concept Names**
   - Iterate over names
     - name to lowercase
     - remove characters `[ ] '`
     - split by underscores and whitespaces
     - Check each query token for a fuzzy match
