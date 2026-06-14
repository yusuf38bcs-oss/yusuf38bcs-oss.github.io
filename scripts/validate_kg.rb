#!/usr/bin/env ruby
require 'yaml'
nodes = YAML.load_file('_data/neural_nodes.yml') rescue []
edges = YAML.load_file('_data/neural_edges.yml') rescue []
node_ids = nodes.map { |n| n['id'] }.compact
missing = []
edges.each { |e| missing << "Edge source #{e['source']}" unless node_ids.include?(e['source']); missing << "Edge target #{e['target']}" unless node_ids.include?(e['target']) }
nodes.each do |n|
  Array(n['prerequisites']).each { |p| missing << "Prerequisite #{p} in #{n['id']}" unless node_ids.include?(p) }
  Array(n['connects_to']).each    { |c| missing << "Connection #{c} in #{n['id']}" unless node_ids.include?(c) }
end
if missing.any?
  puts "❌ Knowledge Graph Errors:"
  missing.each { |m| puts "   • #{m}" }
  exit 1
else
  puts "✓ Knowledge Graph valid: #{nodes.length} nodes, #{edges.length} edges."
  exit 0
end