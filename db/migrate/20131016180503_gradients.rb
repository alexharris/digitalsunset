class Gradients < ActiveRecord::Migration
  def self.up
    create_table :gradients do |t|
      t.string :author
      t.text :note
      t.text :gradient #need to change this type from text to something else?
      t.timestamps
    end
  end

  def self.down
    drop_table :gradients
  end
end
