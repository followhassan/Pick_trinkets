USE picktrinkets;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM products;
DELETE FROM categories;
SET FOREIGN_KEY_CHECKS = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;

INSERT INTO categories (id, name, slug) VALUES
  (1, 'Phone charms', 'phone-charms'),
  (2, 'Bag charms', 'bag-charms'),
  (3, 'Bracelets', 'bracelets');

INSERT INTO products (category_id, name, slug, description, price, stock, image, is_featured) VALUES
(1, 'Enamel Flower Phone Charm', 'enamel-flower-phone-charm',
 'Custom-feeling phone charm with two floral enamel drops on a silver chain. Light enough for daily use — clip it to your case or bag. Handmade in Dhaka. DM us if you want a colour mix of your own.',
 180.00, 8, 'enamel-flower-phone-charm.jpg', 1),
(1, 'Pink Heart Phone Charm', 'pink-heart-phone-charm',
 'Pink beads, a tiny heart, and a phone-strap loop. A small everyday charm. Custom phone charms like this are made to order — message us with your palette.',
 160.00, 10, 'pink-heart-phone-charm.jpg', 0),

(2, 'Pink Headphone Bag Charm', 'pink-headphone-charm',
 'Bag charm with a glossy pink headphone drop, organza bow, angel wing, star, and pearl. Clip it to a tote, pouch, or phone strap. One of our favourite custom mixes.',
 280.00, 6, 'pink-headphone-charm.jpg', 1),
(2, 'Blossom Cord Charm', 'blossom-cord-charm',
 'Navy cord with pale blossom beads and tiny leaves. Wear it as a bag charm or a soft wrap. Handmade, so each one sits a little differently.',
 190.00, 9, 'blossom-cord-charm.jpg', 0),
(2, 'Berry Pearl Bag Charm', 'berry-pearl-bag-charm',
 'Cream pearls and red berry beads on a silver chain — a little cherry mood for zippers and straps.',
 220.00, 7, 'berry-pearl-bag-charm.jpg', 1),

(3, 'Pearl Bow Bracelet', 'pearl-bow-bracelet',
 'Silver chain, cream pearls, crystal spacers, and a small bow charm. Delicate everyday bracelet. Custom length on request.',
 220.00, 8, 'pearl-bow-bracelet.jpg', 1),
(3, 'Bamboo Jade Bracelet', 'bamboo-bracelet',
 'Lime bamboo tubes, jade-green rounds, silver spacers, and a hanging bell drop. A lucky, leafy stack. Extension chain included.',
 250.00, 5, 'bamboo-bracelet.jpg', 1),
(3, 'Bamboo Jade Gold Bracelet', 'bamboo-jade-gold-bracelet',
 'Lime and milk-white bamboo tubes on gold findings, with a clover flower and a dangling bamboo bead. Handmade in Dhaka.',
 260.00, 6, 'bamboo-jade-gold-bracelet.jpg', 1),
(3, 'Bamboo Bell Bracelet', 'bamboo-bell-bracelet',
 'Olive bamboo beads, gold spacers, jade rounds, and three tiny bells. A soft jingle on the wrist.',
 270.00, 5, 'bamboo-bell-bracelet.jpg', 1),
(3, 'Flower Bead Bracelet Set', 'flower-bead-bracelets',
 'Stretch stack of daisy-bead bracelets in pink, mint, black, and butter yellow. Wear one or pile them on. Price is for the set.',
 320.00, 4, 'flower-bead-bracelets.jpg', 1),
(3, 'Cherry Pearl Bracelet', 'cherry-pearl-bracelet',
 'Pearls with tiny red berries and a silver clasp. Sits pretty alone or next to a thinner chain.',
 240.00, 6, 'cherry-pearl-bracelet.jpg', 0),
(3, 'Owl Pearl Bracelet', 'owl-pearl-bracelet',
 'Dainty pearls and a tiny owl charm. A small good-luck piece for wrists or to gift.',
 210.00, 7, 'owl-pearl-bracelet.jpg', 0),
(3, 'Cream Pearl Cuff', 'cream-pearl-cuff',
 'Open cuff of cream pearls on gold-tone wire. Currently sold out — watch Facebook for the next batch.',
 380.00, 0, 'cream-pearl-cuff.jpg', 0),
(3, 'Fruit Pearl Bracelet Trio', 'fruit-pearl-bracelets',
 'Three stretch bracelets: leaf-and-pearl, black-and-gold, and amber with a fruit charm. Mix them. Price is for the trio.',
 350.00, 5, 'fruit-pearl-bracelets.jpg', 0),
(3, 'Green Blossom Bracelet', 'green-blossom-bracelet',
 'White blossoms and green beads on a silver chain. Fresh, simple, handmade.',
 200.00, 8, 'green-blossom-bracelet.jpg', 0);

INSERT INTO admins (username, password_hash) VALUES
  ('admin', '$2y$10$ljBS742k/2/UgQB.ZxtvmuoEkbTKYHy8PlNzUttFS9mUUSbFZVmNG')
ON DUPLICATE KEY UPDATE username = username;
