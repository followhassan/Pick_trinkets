USE picktrinkets;

SET NAMES utf8mb4;

INSERT INTO staff (username, password_hash) VALUES
('admin', '$2y$10$4a9IiyL5Qyb2PfC3.k5pCOPPgcKczkkHJ8uRrfbLL3rPLpWfvunCG');
-- Default password: picktrinkets  — change this before production.

INSERT INTO categories (slug, name, sort_order) VALUES
('phone-charms', 'Phone charms', 1),
('bag-charms', 'Bag charms', 2),
('bracelets', 'Bracelets', 3);

INSERT INTO products
  (category_id, slug, name, description, price_bdt, stock, image, is_active)
VALUES
(
  1,
  'pink-headphone-charm',
  'Pink Headphone Charm',
  'Custom phone charm made for a customer — pink headphone drop with a sheer bow, star spike, wing, and pearl. Clip it to your case, keys, or bag. DM us on Facebook or Instagram for a made-to-order version in your colours.',
  350.00, 6, 'products/pink-headphone-charm.jpg', 1
),
(
  1,
  'blossom-cord-bracelet',
  'Blossom Cord Charm',
  'Navy cord strung with tiny pink blossoms and leaves. Wear it as a dainty bracelet or clip it onto a phone strap. Handmade in Dhaka; custom colours available.',
  220.00, 9, 'products/blossom-cord-bracelet.jpg', 1
),
(
  2,
  'cherry-pearl-charm',
  'Cherry Pearl Bag Charm',
  'Layered glass pearls with tiny cherry drops and a lobster clasp — made to hang from a tote, pouch, or zip pull. A little fruit-stand moment for your everyday bag.',
  420.00, 4, 'products/cherry-pearl-charm.jpg', 1
),
(
  2,
  'studio-ghibli-blossom-charm',
  'Blossom Walk Bag Charm',
  'White blossoms, jade chips, and a tiny framed scene on a silver chain. Soft, storybook, and ready to clip onto a bag. Currently sold out — message us to restock or customise.',
  380.00, 0, 'products/studio-ghibli-blossom-charm.jpg', 1
),
(
  3,
  'pearl-bow-bracelet',
  'Coquette Pearl Bow Bracelet',
  'Silver chain bracelet with cream pearls, crystal spacers, and a ribbon bow charm. Adjustable clasp. Soft coquette energy for everyday Dhaka outfits.',
  280.00, 8, 'products/pearl-bow-bracelet.jpg', 1
),
(
  3,
  'bamboo-bell-bracelet',
  'Jade Bamboo Bell Bracelet',
  'Lime bamboo glass tubes, jade rounds, and silver findings with a lily-bell drop and dangling bamboo charm. Lightweight and a little lucky.',
  320.00, 5, 'products/bamboo-bell-bracelet.jpg', 1
),
(
  3,
  'bamboo-blossom-bracelet',
  'Bamboo Blossom Bracelet',
  'Mint and white bamboo beads on gold findings, finished with a clear blossom and a matching bamboo dangle. Fresh, springy, handmade.',
  300.00, 7, 'products/bamboo-blossom-bracelet.jpg', 1
),
(
  3,
  'lucky-bell-bamboo-bracelet',
  'Lucky Bell Bamboo Bracelet',
  'Sage bamboo tubes, gold spacers, jade rounds, and a cluster of tiny lucky bells. They chime when you move — a small celebration on the wrist.',
  340.00, 4, 'products/lucky-bell-bamboo-bracelet.jpg', 1
),
(
  3,
  'dark-jade-gold-bracelet',
  'Dark Jade Gold Bamboo Bracelet',
  'Deep green bamboo glass paired with textured gold tubes and a pale jade drop. Bold and a little royal. Sold out for now — custom remakes welcome.',
  360.00, 0, 'products/dark-jade-gold-bracelet.jpg', 1
),
(
  3,
  'white-jade-leaf-bracelet',
  'White Jade Leaf Bracelet',
  'Milky bamboo beads, silver spacers, one bright jade round, and a tiny leaf charm. Quiet, clean, easy to stack.',
  280.00, 6, 'products/white-jade-leaf-bracelet.jpg', 1
),
(
  3,
  'flower-bead-bracelets',
  'Flower Bead Bracelet Set',
  'Colourful daisy-bead stretch bracelets — pink, mint, black, and butter yellow. Pick one or stack them. Cute handmade accessories from our Dhaka studio.',
  250.00, 10, 'products/flower-bead-bracelets.jpg', 1
),
(
  3,
  'fruit-pearl-bracelets',
  'Fruit Pearl Bracelet Stack',
  'Freshwater-look pearls mixed with tiny fruit beads on stretch cord. A picnic on your wrist. Available as a mix-and-match stack.',
  260.00, 3, 'products/fruit-pearl-bracelets.jpg', 1
),
(
  3,
  'pearl-leaf-bracelet',
  'Pearl Leaf Bracelet',
  'Classic pearl strand with a silver leaf charm, photographed on wood. Everyday pretty with a little garden detail.',
  300.00, 5, 'products/pearl-leaf-bracelet.jpg', 1
);
