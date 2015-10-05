class Material < Sample
  attr_accessor :reference
end

class MaterialSerializer < SampleSerializer
  attributes :reference
end

class ReactionSerializer < ActiveModel::Serializer
  attributes :id, :type, :name, :created_at, :collection_labels

  has_many :starting_materials, serializer: MaterialSerializer
  has_many :reactants, serializer: MaterialSerializer
  has_many :products, serializer: MaterialSerializer

  has_many :literatures

  def starting_materials
    decorated_materials( object.reactions_starting_material_samples )
  end

  def reactants
    decorated_materials( object.reactions_reactant_samples )
  end

  def products
    decorated_materials( object.reactions_product_samples )
  end

  def created_at
    object.created_at.strftime("%d.%m.%Y, %H:%M")
  end

  def collection_labels
    collections = object.collections
    collections.flat_map(&:label).zip(collections.flat_map(&:is_shared)).uniq
  end

  def type
    'reaction'
  end

  private

    def decorated_materials reaction_materials
      reaction_materials_attributes = Hash[Array(reaction_materials).map {|r| [r.sample_id, r.attributes]}]
      reaction_materials.map do |reaction_material|
        m = Material.new(reaction_material.sample.attributes)
        rma = reaction_materials_attributes[reaction_material.sample_id] || {}
        m.reference = rma['reference']
        m
      end
    end

end
