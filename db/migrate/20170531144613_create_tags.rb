class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name, index: true
      t.belongs_to :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
