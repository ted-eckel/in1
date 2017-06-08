class Tag < ActiveRecord::Base
  belongs_to :user
  has_many :taggings, dependent: :destroy
  has_many :notes, through: :taggings

  validates :user_id, presence: true
  validates :name, length: { minimum: 1 }, uniqueness: {scope: :user_id}
end
