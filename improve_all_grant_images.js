// Script to improve all grant images with relevant, high-quality visuals

import fetch from 'node-fetch';

// Create a mapping of categories/industries to relevant images
// Each category has multiple images to provide variety
const categoryImageMap = {
  'Agriculture': [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&h=280&q=80', // Farm field
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500&h=280&q=80', // Modern farming
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&h=280&q=80', // Crops closeup
    'https://images.unsplash.com/photo-1529511582893-2d7e684dd128?auto=format&fit=crop&w=500&h=280&q=80', // Farmland aerial
    'https://images.unsplash.com/photo-1486328228599-85db4443971f?auto=format&fit=crop&w=500&h=280&q=80', // Organic farming
    'https://images.unsplash.com/photo-1591255514622-3f407a8616c4?auto=format&fit=crop&w=500&h=280&q=80'  // Agritech
  ],
  'Manufacturing': [
    'https://images.unsplash.com/photo-1566296995662-36218a4eb0b3?auto=format&fit=crop&w=500&h=280&q=80', // Factory
    'https://images.unsplash.com/photo-1590359630891-f0a0db4ab7a5?auto=format&fit=crop&w=500&h=280&q=80', // Manufacturing line
    'https://images.unsplash.com/photo-1565742070532-2a48e556e6d3?auto=format&fit=crop&w=500&h=280&q=80', // Industrial equipment
    'https://images.unsplash.com/photo-1611288875785-baa04a75ec40?auto=format&fit=crop&w=500&h=280&q=80', // Advanced manufacturing
    'https://images.unsplash.com/photo-1558903159-add44db68c1b?auto=format&fit=crop&w=500&h=280&q=80'  // Production line
  ],
  'Technology': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&h=280&q=80', // Technology abstract
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80', // Tech innovation
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=280&q=80', // Tech developer
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&h=280&q=80', // Coding
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&h=280&q=80', // Tech futuristic
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&h=280&q=80'  // Tech data visualization
  ],
  'Digital Media': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&h=280&q=80', // Digital media
    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=500&h=280&q=80', // Video production
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=500&h=280&q=80', // Media editing
    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=500&h=280&q=80', // Content creation
    'https://images.unsplash.com/photo-1523251692472-e847d68c30ed?auto=format&fit=crop&w=500&h=280&q=80'  // Social media
  ],
  'Clean Technology': [
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=500&h=280&q=80', // Clean energy
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80', // Solar panels
    'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=500&h=280&q=80', // Wind turbines
    'https://images.unsplash.com/photo-1569212981748-6935e5c5a0e9?auto=format&fit=crop&w=500&h=280&q=80', // Sustainable tech
    'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=500&h=280&q=80'  // Green technology
  ],
  'Healthcare': [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&h=280&q=80', // Medical research
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&h=280&q=80', // Medical technology
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&h=280&q=80', // Healthcare facility
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=500&h=280&q=80', // Healthcare professional
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=500&h=280&q=80'  // Medical equipment
  ],
  'Education': [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&h=280&q=80', // Classroom
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&h=280&q=80', // Education tech
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=500&h=280&q=80', // Graduation
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&h=280&q=80', // Learning outdoors
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=500&h=280&q=80'  // Study materials
  ],
  'Tourism': [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=500&h=280&q=80', // Scenic landscape
    'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=500&h=280&q=80', // Beach tourism
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=500&h=280&q=80', // Urban tourism
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=500&h=280&q=80', // Tourist attractions
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&h=280&q=80'  // Travel destinations
  ],
  'Arts and Culture': [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&h=280&q=80', // Art gallery
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=500&h=280&q=80', // Performing arts
    'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=500&h=280&q=80', // Music
    'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?auto=format&fit=crop&w=500&h=280&q=80', // Cultural event
    'https://images.unsplash.com/photo-1465225314224-587cd83d322b?auto=format&fit=crop&w=500&h=280&q=80'  // Theatre
  ],
  'Small Business': [
    'https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=500&h=280&q=80', // Small business storefront
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80', // Small business owner
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=500&h=280&q=80', // Startup team
    'https://images.unsplash.com/photo-1570086464668-f5218879d3b3?auto=format&fit=crop&w=500&h=280&q=80', // Local shop
    'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=500&h=280&q=80'  // Small business meeting
  ],
  'Indigenous Business': [
    'https://images.unsplash.com/photo-1583249598754-b7a2f59651fb?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous art
    'https://images.unsplash.com/photo-1599017810774-3156be64596f?auto=format&fit=crop&w=500&h=280&q=80', // Community gathering
    'https://images.unsplash.com/photo-1635204520007-5ec0d6738b39?auto=format&fit=crop&w=500&h=280&q=80', // Indigenous cultural items
    'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?auto=format&fit=crop&w=500&h=280&q=80', // Traditional practices
    'https://images.unsplash.com/photo-1606503825008-9c1476df02ce?auto=format&fit=crop&w=500&h=280&q=80'  // Cultural business
  ],
  'Export': [
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c1?auto=format&fit=crop&w=500&h=280&q=80', // Shipping containers
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=500&h=280&q=80', // Global trade
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=500&h=280&q=80', // Cargo ship
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&h=280&q=80', // International business
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=500&h=280&q=80'  // Logistics
  ],
  'Innovation': [
    'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?auto=format&fit=crop&w=500&h=280&q=80', // Creative thinking
    'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=500&h=280&q=80', // Innovation concept
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=500&h=280&q=80', // Research lab
    'https://images.unsplash.com/photo-1456428746267-a1756408f782?auto=format&fit=crop&w=500&h=280&q=80', // Innovative design
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&h=280&q=80'  // Modern architecture/innovation
  ],
  'Research': [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=500&h=280&q=80', // Scientific research
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=500&h=280&q=80', // Laboratory
    'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=500&h=280&q=80', // Research equipment
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=500&h=280&q=80', // Data analysis
    'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=500&h=280&q=80'  // Research collaboration
  ],
  'Environment': [
    'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=500&h=280&q=80', // Natural landscape
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=500&h=280&q=80', // Forest
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&h=280&q=80', // Conservation
    'https://images.unsplash.com/photo-1584690270335-8c8d1561e639?auto=format&fit=crop&w=500&h=280&q=80', // Environmental protection
    'https://images.unsplash.com/photo-1498925008800-019c6bfcf411?auto=format&fit=crop&w=500&h=280&q=80'  // Sustainability
  ],
  'Community Development': [
    'https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?auto=format&fit=crop&w=500&h=280&q=80', // Community event
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&h=280&q=80', // Community building
    'https://images.unsplash.com/photo-1525026198548-4baa812f1183?auto=format&fit=crop&w=500&h=280&q=80', // Volunteer work
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&h=280&q=80', // Community meeting
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=500&h=280&q=80'  // Neighborhood improvement
  ],
  'Youth': [
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=500&h=280&q=80', // Youth activities
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=500&h=280&q=80', // Youth education
    'https://images.unsplash.com/photo-1602537742161-63d14e709455?auto=format&fit=crop&w=500&h=280&q=80', // Youth group
    'https://images.unsplash.com/photo-1527633412983-d80af308e660?auto=format&fit=crop&w=500&h=280&q=80', // Youth leadership
    'https://images.unsplash.com/photo-1541883221-c674a918b347?auto=format&fit=crop&w=500&h=280&q=80'  // Youth sports
  ],
  'Entrepreneurship': [
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=280&q=80', // Entrepreneur
    'https://images.unsplash.com/photo-1664575198308-3959904fa430?auto=format&fit=crop&w=500&h=280&q=80', // Startup workspace
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80', // Business team
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=280&q=80', // Pitch meeting
    'https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&w=500&h=280&q=80'  // Business planning
  ],
  'Development': [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&h=280&q=80', // Development team
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&h=280&q=80', // Business development
    'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=500&h=280&q=80', // Urban development
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=500&h=280&q=80', // Construction project
    'https://images.unsplash.com/photo-1581897764648-32b51f10c969?auto=format&fit=crop&w=500&h=280&q=80'  // Infrastructure
  ],
  'Women Entrepreneurs': [
    'https://images.unsplash.com/photo-1573497620306-b79d0804b19e?auto=format&fit=crop&w=500&h=280&q=80', // Female entrepreneur
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=500&h=280&q=80', // Women business leaders
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&h=280&q=80', // Women's collaborative workspace
    'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=500&h=280&q=80', // Female business owner
    'https://images.unsplash.com/photo-1573165662973-4ab3cf3d3508?auto=format&fit=crop&w=500&h=280&q=80'  // Woman-led team
  ],
  'COVID-19': [
    'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=500&h=280&q=80', // Healthcare workers
    'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&w=500&h=280&q=80', // Pandemic response
    'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=500&h=280&q=80', // Business adaptation
    'https://images.unsplash.com/photo-1605575035455-05a787ba16e6?auto=format&fit=crop&w=500&h=280&q=80', // Virtual work
    'https://images.unsplash.com/photo-1586273279056-42944ebad160?auto=format&fit=crop&w=500&h=280&q=80'  // Health safety
  ],
  'Rural Development': [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&h=280&q=80', // Rural landscape
    'https://images.unsplash.com/photo-1464519046765-f6d70b82a0df?auto=format&fit=crop&w=500&h=280&q=80', // Farm infrastructure
    'https://images.unsplash.com/photo-1598767099597-98d09a3c0697?auto=format&fit=crop&w=500&h=280&q=80', // Rural community
    'https://images.unsplash.com/photo-1500673587004-1f1eb5fe5cf3?auto=format&fit=crop&w=500&h=280&q=80', // Small town development
    'https://images.unsplash.com/photo-1464268677137-1184599bc50a?auto=format&fit=crop&w=500&h=280&q=80'  // Agricultural innovation
  ],
  'Digital Adoption': [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&h=280&q=80', // Digital transformation
    'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=500&h=280&q=80', // Digital tools
    'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=500&h=280&q=80', // Technology adoption
    'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?auto=format&fit=crop&w=500&h=280&q=80', // Digital workspace
    'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=500&h=280&q=80'  // Business technology
  ],
  'Skills Development': [
    'https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?auto=format&fit=crop&w=500&h=280&q=80', // Vocational training
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80', // Team skills
    'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=500&h=280&q=80', // Digital skills
    'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=500&h=280&q=80', // Learning workshop
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&h=280&q=80'  // Professional development
  ],
  'Investment': [
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&h=280&q=80', // Financial investment
    'https://images.unsplash.com/photo-1568234928966-359c35dd8b49?auto=format&fit=crop&w=500&h=280&q=80', // Investment growth
    'https://images.unsplash.com/photo-1565514020179-026b92b2a0b7?auto=format&fit=crop&w=500&h=280&q=80', // Financial data
    'https://images.unsplash.com/photo-1444653389962-8149286c578a?auto=format&fit=crop&w=500&h=280&q=80', // Business meeting
    'https://images.unsplash.com/photo-1590283603385-c1c9cfd24fd1?auto=format&fit=crop&w=500&h=280&q=80'  // Investment office
  ],
  'Science': [
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=500&h=280&q=80', // Science research
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&h=280&q=80', // Laboratory work
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=500&h=280&q=80', // Scientific equipment
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=500&h=280&q=80', // Scientific innovation
    'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?auto=format&fit=crop&w=500&h=280&q=80'  // Science education
  ],
  'Energy': [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80', // Solar energy
    'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=500&h=280&q=80', // Wind energy
    'https://images.unsplash.com/photo-1513828646384-12080ddf5b8a?auto=format&fit=crop&w=500&h=280&q=80', // Energy infrastructure
    'https://images.unsplash.com/photo-1548429930-add231be8798?auto=format&fit=crop&w=500&h=280&q=80', // Oil and gas
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=500&h=280&q=80'  // Energy production
  ],
  'Finance': [
    'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=500&h=280&q=80', // Financial planning
    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=500&h=280&q=80', // Banking
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&h=280&q=80', // Business finance
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&h=280&q=80', // Financial data
    'https://images.unsplash.com/photo-1638913662180-afc4334cf422?auto=format&fit=crop&w=500&h=280&q=80'  // Financial technology
  ],
  'Business': [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&h=280&q=80', // Business meeting
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&h=280&q=80', // Business analysis
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=280&q=80', // Business professional
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&h=280&q=80', // Business leader
    'https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=500&h=280&q=80'  // Office environment
  ],
  'Digital': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&h=280&q=80', // Digital world
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&h=280&q=80', // Digital technology
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&h=280&q=80', // Digital workplace
    'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=500&h=280&q=80', // Digital devices
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=500&h=280&q=80'  // Digital data
  ],
  'Social Impact': [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&h=280&q=80', // Community project
    'https://images.unsplash.com/photo-1574607383476-1dc1195bb8cc?auto=format&fit=crop&w=500&h=280&q=80', // Social support
    'https://images.unsplash.com/photo-1469571486292-b53601010b75?auto=format&fit=crop&w=500&h=280&q=80', // Volunteer group
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&h=280&q=80', // Social innovation
    'https://images.unsplash.com/photo-1593113598332-cd59a93f2647?auto=format&fit=crop&w=500&h=280&q=80'  // Environmental sustainability
  ],
  'Sustainability': [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&h=280&q=80', // Renewable energy
    'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=500&h=280&q=80', // Green community
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&h=280&q=80', // Sustainable living
    'https://images.unsplash.com/photo-1524419986249-348e8fa6ad4a?auto=format&fit=crop&w=500&h=280&q=80', // Recycling
    'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=500&h=280&q=80'  // Sustainable resources
  ],
  'Forestry': [
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=500&h=280&q=80', // Forest landscape
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=500&h=280&q=80', // Forest management
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&h=280&q=80', // Woodland
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=500&h=280&q=80', // Forestry industry
    'https://images.unsplash.com/photo-1569155346758-82c5ef2851f5?auto=format&fit=crop&w=500&h=280&q=80'  // Sustainable forestry
  ]
};

// Category fallbacks (will be used if a specific match is not found)
const fallbackImages = [
  'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=500&h=280&q=80', // General business grant
  'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=500&h=280&q=80', // Funding concept
  'https://images.unsplash.com/photo-1621866808265-38132283addc?auto=format&fit=crop&w=500&h=280&q=80', // Finance and funding 
  'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=500&h=280&q=80', // Investment
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=280&q=80', // Business team
  'https://images.unsplash.com/photo-1530099486328-e021101a494a?auto=format&fit=crop&w=500&h=280&q=80'  // Modern business
];

// Track used images to prevent duplication
let usedImages = new Set();

// Function to get grants by type
async function getGrantsByType(type) {
  try {
    const response = await fetch(`http://localhost:5000/api/grants/type/${type}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} grants:`, error);
    throw error;
  }
}

// Function to update grant image
async function updateGrantImage(id, imageUrl) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/grants/update-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        imageUrl: imageUrl
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update image for grant ID ${id}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating grant image for ID ${id}:`, error);
    throw error;
  }
}

// Function to get the best image for a grant based on its details
function getBestImageForGrant(grant) {
  let potentialImages = [];
  
  // First look for category match
  if (grant.category && categoryImageMap[grant.category]) {
    potentialImages = [...categoryImageMap[grant.category]];
  }
  
  // Look for industry match if no category or as additional options
  if (grant.industry && categoryImageMap[grant.industry]) {
    potentialImages = [...potentialImages, ...categoryImageMap[grant.industry]];
  }
  
  // Check title and description for keywords
  const grantText = (grant.title + ' ' + grant.description).toLowerCase();
  
  for (const [category, images] of Object.entries(categoryImageMap)) {
    const categoryLower = category.toLowerCase();
    if (grantText.includes(categoryLower)) {
      potentialImages = [...potentialImages, ...images];
    }
  }
  
  // If no matches or not enough options, add some fallbacks
  if (potentialImages.length < 2) {
    potentialImages = [...potentialImages, ...fallbackImages];
  }
  
  // Filter out already used images
  const availableImages = potentialImages.filter(img => !usedImages.has(img));
  
  // If all potential images are used, reset and try again
  if (availableImages.length === 0) {
    console.log(`All potential images for grant ID ${grant.id} are already used. Selecting from all options.`);
    // Try to find the least used images
    const imageCountMap = new Map();
    potentialImages.forEach(img => {
      imageCountMap.set(img, (imageCountMap.get(img) || 0) + 1);
    });
    
    // Sort by least used
    potentialImages.sort((a, b) => imageCountMap.get(a) - imageCountMap.get(b));
    
    // Take the least used image
    const selectedImage = potentialImages[0];
    usedImages.add(selectedImage);
    return selectedImage;
  }
  
  // Choose a random image from available options
  const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  usedImages.add(selectedImage);
  return selectedImage;
}

// Main function to improve all grant images
async function improveAllGrantImages() {
  try {
    // Get grants by type
    console.log('Fetching all grants...');
    const federalGrants = await getGrantsByType('federal');
    const provincialGrants = await getGrantsByType('provincial');
    const privateGrants = await getGrantsByType('private');
    
    console.log(`Retrieved ${federalGrants.length} federal grants.`);
    console.log(`Retrieved ${provincialGrants.length} provincial grants.`);
    console.log(`Retrieved ${privateGrants.length} private grants.`);
    
    const allGrants = [...federalGrants, ...provincialGrants, ...privateGrants];
    console.log(`Total grants: ${allGrants.length}`);
    
    // Initialize usedImages set with current images to avoid duplication
    allGrants.forEach(grant => {
      if (grant.imageUrl) {
        usedImages.add(grant.imageUrl);
      }
    });
    
    let updatedCount = 0;
    
    // Process grants in batches to avoid overwhelming the server
    const batchSize = 10;
    for (let i = 0; i < allGrants.length; i += batchSize) {
      const batch = allGrants.slice(i, i + batchSize);
      
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(allGrants.length/batchSize)}...`);
      
      // Process each grant in the batch
      for (const grant of batch) {
        // Skip grants with already good images (those we've processed before)
        if (grant.imageUrl && (grant.imageUrl.includes('unsplash.com') || grant.imageUrl.includes('company_logos'))) {
          console.log(`Grant ID ${grant.id} already has a good image. Skipping.`);
          continue;
        }
        
        const newImageUrl = getBestImageForGrant(grant);
        
        console.log(`Updating image for grant ID ${grant.id}: ${grant.title}`);
        console.log(`Current image: ${grant.imageUrl || 'No image'}`);
        console.log(`New image: ${newImageUrl}`);
        
        await updateGrantImage(grant.id, newImageUrl);
        updatedCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log(`Completed batch ${Math.floor(i/batchSize) + 1}. Updated ${updatedCount} grants so far.`);
      
      // Larger delay between batches
      if (i + batchSize < allGrants.length) {
        console.log('Waiting 2 seconds before processing next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\nCompleted! Updated ${updatedCount} grants with appropriate images.`);
    
  } catch (error) {
    console.error('Error in improveAllGrantImages:', error);
  }
}

// Run the function
improveAllGrantImages().catch(console.error);