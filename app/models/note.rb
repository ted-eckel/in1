class Note < ActiveRecord::Base
  belongs_to :user
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings

  # def all_tags=(tags)
  #   self.tags = tags.map do |tag|
  #     Tag.where("name = ? AND user_id = ?", name: tag.name, user_id: tag.user_id).first_or_create!
  #   end
  # end
  #
  # def all_tags
  #   self.tags.map(&:name)
  # end

  def all_tags=(string)
    array = string.split("-------314159265358979323846")
    puts "array #{array}"
    id = array[0].to_i
    puts "id: #{id}"
    names = array[1..-1]
    puts "names: #{names}"
    self.tags = names.map do |name|
      Tag.where("name = ? AND user_id = ?", name, id).first_or_create!(name: name, user_id: id)
    end
  end

  def all_tags
    self.tags.map(&:name).join(" ")
  end
end
