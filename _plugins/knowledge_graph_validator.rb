# frozen_string_literal: true

Jekyll::Hooks.register :site, :post_read do |site|
  nodes = Array(site.data['neural_nodes'])
  edges = Array(site.data['neural_edges'])
  node_map = {}
  node_ids = Set.new

  nodes.each do |n|
    id = n['id']
    Jekyll.logger.abort_with "KnowledgeGraph:", "Node missing required 'id' field" unless id
    Jekyll.logger.abort_with "KnowledgeGraph:", "Duplicate node_id: #{id}" if node_ids.include?(id)
    node_ids << id
    node_map[id] = n
  end

  edges.each_with_index do |edge, idx|
    src, tgt = edge['source'], edge['target']
    Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} missing source/target" unless src && tgt
    Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} missing source: #{src}" unless node_ids.include?(src)
    Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} missing target: #{tgt}" unless node_ids.include?(tgt)
  end

  nodes.each do |n|
    Array(n['prerequisites']).each { |p| Jekyll.logger.abort_with "KnowledgeGraph:", "Node #{n['id']} missing prerequisite: #{p}" unless node_ids.include?(p) }
    Array(n['connects_to']).each    { |c| Jekyll.logger.abort_with "KnowledgeGraph:", "Node #{n['id']} missing connection: #{c}" unless node_ids.include?(c) }
  end

  referenced = Set.new
  edges.each { |e| referenced << e['source']; referenced << e['target'] }
  nodes.each do |n|
    Array(n['prerequisites']).each { |p| referenced << p }
    Array(n['connects_to']).each    { |c| referenced << c }
  end
  orphans = node_ids - referenced
  orphans.reject! { |id| node_map[id] && node_map[id]['entry'] == true }
  unless orphans.empty?
    Jekyll.logger.warn "KnowledgeGraph:", "Orphan nodes: #{orphans.to_a.join(', ')} — add 'entry: true' to suppress"
  end

  visiting, visited = Set.new, Set.new
  detect_cycle = lambda do |nid, path|
    return true if visiting.include?(nid)
    return false if visited.include?(nid)
    visiting << nid
    node_map[nid] && Array(node_map[nid]['prerequisites']).each { |prereq|
      if detect_cycle.call(prereq, path)
        path.unshift(nid)
        return true
      end
    }
    visiting.delete(nid)
    visited << nid
    false
  end

  nodes.each do |n|
    next if visited.include?(n['id'])
    path = []
    if detect_cycle.call(n['id'], path)
      Jekyll.logger.abort_with "KnowledgeGraph:", "Circular prerequisite: #{path.join(' → ')}"
    end
  end

  Jekyll.logger.info "KnowledgeGraph:", "Validated #{nodes.length} nodes, #{edges.length} edges. Topology clean."
end