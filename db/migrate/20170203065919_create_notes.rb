class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :title
      t.text :content
      t.string :color, default: "DEFAULT"
      t.datetime :initial_created_at
      t.datetime :initial_updated_at
      t.string :state, default: "INBOX", null: false
      t.references :user

      t.timestamps null: false
    end

    add_index :notes, :user_id
  end
end
