for file in *; do
  new_name=${file,,}
  mv "$file" "$new_name"
done