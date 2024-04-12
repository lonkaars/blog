module TagColor
  def to_tag_color(str)
    sum = 0
    str.chars.each do |i|
      sum += ?i.ord
      sum %= 360
    end
    sum
  end
end

Liquid::Template.register_filter(TagColor)

