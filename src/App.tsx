import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Star, Cake, Sparkles, Camera, DollarSign, MessageCircle, Heart, CircleCheck as CheckCircle2 } from 'lucide-react'

export function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Cake className="size-8 text-primary" />
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                CakeCraft
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </a>
              <a href="#gallery" className="text-sm font-medium hover:text-primary transition-colors">
                Gallery
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">
                Reviews
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button
                size="sm"
                className="rounded-full"
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(200, 98, 42, 0.1) 0%, transparent 70%)',
          }}
        />
        <div className="container mx-auto px-6 relative">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div className="space-y-6 reveal">
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-semibold"
                style={{ background: 'var(--badge-bg)', color: 'var(--primary)' }}
              >
                <Sparkles className="size-3.5 mr-1.5" />
                Best Bakery 2024
              </Badge>

              <h1
                className="text-5xl md:text-6xl font-bold leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Bake Joy Into Every{' '}
                <span
                  className="text-primary"
                  style={{ fontFamily: 'var(--font-script)', fontStyle: 'italic' }}
                >
                  Celebration
                </span>
              </h1>

              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                From classic sponges to tall layer masterpieces, we create delicious moments that bring
                people together and make every occasion unforgettable.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                  style={{ background: 'var(--primary)', color: 'white', animation: 'pulse-ring 2.2s infinite' }}
                >
                  Book a Cake
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-12 font-semibold border-2"
                  style={{ borderColor: 'var(--text-dark)', color: 'var(--text-dark)' }}
                >
                  View Gallery
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    5,000+
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Cakes Made
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-3xl font-bold flex items-center gap-1" style={{ fontFamily: 'var(--font-display)' }}>
                    4.9 <Star className="size-6 fill-[var(--star-gold)] text-[var(--star-gold)]" />
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Rating
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    10+
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Flavors
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal relative">
              <div
                className="rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                style={{ background: 'var(--white)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=700&fit=crop"
                  alt="Beautiful layered cake"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="size-4 fill-[var(--star-gold)] text-[var(--star-gold)]" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold mt-1">CakeCraft Bakery</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Trusted by 5,000+ customers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20" style={{ background: 'var(--bg-section)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{ background: 'var(--badge-bg)', color: 'var(--primary)' }}
            >
              <Cake className="size-3.5 mr-1.5" />
              Our Menu
            </Badge>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Our Sweet Creations
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              From classic sponges to tall layer masterpieces, we've got every craving covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎂', title: 'Custom Layer Cake', price: 'From $45', desc: 'Personalized multi-layer cakes for any celebration' },
              { icon: '🧁', title: 'Cupcake Bundles', price: 'From $18', desc: 'Perfect for parties and events' },
              { icon: '🍰', title: 'Cheesecakes', price: 'From $30', desc: 'Rich, creamy, perfectly set' },
              { icon: '🎉', title: 'Wedding Tiers', price: 'From $180', desc: 'Elegant designs for your special day' },
              { icon: '🍫', title: 'Chocolate Drip Cake', price: 'From $55', desc: 'Decadent chocolate lover\'s dream' },
              { icon: '🌸', title: 'Floral Fondant Cake', price: 'From $75', desc: 'Artistic edible flowers and designs' },
            ].map((service, i) => (
              <Card
                key={i}
                className="reveal p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <div
                  className="size-12 rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'var(--badge-bg)' }}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                  {service.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                    {service.price}
                  </span>
                  <a
                    href="#booking"
                    className="text-sm font-medium hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    Book →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{ background: 'var(--badge-bg)', color: 'var(--primary)' }}
            >
              <Camera className="size-3.5 mr-1.5" />
              Gallery
            </Badge>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Our Happy Celebrations
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              These are some of our adorable creations that will inspire you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { img: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&h=500&fit=crop', name: 'Emma\'s Wedding', type: 'Floral Tier' },
              { img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&h=500&fit=crop', name: 'Birthday Special', type: 'Chocolate Drip' },
              { img: 'https://images.unsplash.com/photo-1562440499-64c9a5c676d1?w=500&h=500&fit=crop', name: 'Anniversary Joy', type: 'Red Velvet' },
              { img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&h=500&fit=crop', name: 'Sarah\'s Shower', type: 'Cupcake Tower' },
              { img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop', name: 'Garden Party', type: 'Floral Design' },
              { img: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=500&h=500&fit=crop', name: 'Golden Celebration', type: 'Custom Layer' },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal group relative overflow-hidden rounded-2xl cursor-pointer aspect-square"
              >
                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-semibold text-lg">{item.name}</div>
                    <div className="text-sm opacity-90">{item.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center reveal">
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Fallen in love with a design?
            </p>
            <Button variant="outline" className="rounded-full px-8" style={{ borderColor: 'var(--text-dark)' }}>
              Show More Photos
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20" style={{ background: 'var(--bg-section)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{ background: 'var(--badge-bg)', color: 'var(--primary)' }}
            >
              <DollarSign className="size-3.5 mr-1.5" />
              Pricing
            </Badge>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Simple Pricing
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Choose the perfect package for your next special occasion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <Card className="reveal p-8 hover:shadow-xl transition-all" style={{ borderColor: 'var(--card-border)' }}>
              <div className="text-4xl mb-4">🧁</div>
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                <span style={{ color: 'var(--primary)' }}>$35</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Single-tier cake</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">2 flavor options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Basic decoration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Serves up to 8</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full rounded-full" style={{ borderColor: 'var(--text-dark)' }}>
                Book Now
              </Button>
            </Card>

            {/* Classic - Most Popular */}
            <Card
              className="reveal p-8 transform scale-105 shadow-2xl"
              style={{
                borderWidth: '2px',
                borderColor: 'var(--primary)',
                background: 'linear-gradient(to bottom, var(--white), var(--bg-section))',
              }}
            >
              <Badge
                className="rounded-full px-3 py-1 text-xs font-semibold mb-4"
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                ⭐ Most Popular
              </Badge>
              <div className="text-4xl mb-4">🎂</div>
              <h3 className="text-2xl font-bold mb-2">Classic</h3>
              <div className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                <span style={{ color: 'var(--primary)' }}>$65</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Two-tier cake</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Free design consult</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Full decoration suite</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Custom message topper</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Serves up to 20</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Same-day pickup option</span>
                </li>
              </ul>
              <Button className="w-full rounded-full font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
                Book Now
              </Button>
            </Card>

            {/* Luxury */}
            <Card className="reveal p-8 hover:shadow-xl transition-all" style={{ borderColor: 'var(--card-border)' }}>
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-2xl font-bold mb-2">Luxury</h3>
              <div className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                <span style={{ color: 'var(--primary)' }}>$120</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Three-tier masterpiece</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Premium floral fondant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Personalized topper</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Ribbon & box packaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Priority delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm">Serves up to 50</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full rounded-full" style={{ borderColor: 'var(--text-dark)' }}>
                Book Now
              </Button>
            </Card>
          </div>

          <div className="text-center mt-8 reveal">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              * Pricing may vary based on size and custom design additions
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
              style={{ background: 'var(--badge-bg)', color: 'var(--primary)' }}
            >
              <MessageCircle className="size-3.5 mr-1.5" />
              Reviews
            </Badge>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What Cake Lovers Say
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Join thousands of happy customers who trust us for their tastiest tables
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                text: "Ordered a 3-tier floral cake for my wedding — every guest was speechless. The fondant work was immaculate.",
                name: "Sarah Johnson",
                location: "Nairobi",
                avatar: "SJ"
              },
              {
                text: "They made my daughter's unicorn cake look exactly like the photo I sent. Absolutely magical!",
                name: "Matthew Chen",
                location: "Mombasa",
                avatar: "MC"
              },
              {
                text: "Best cheesecake I've ever tasted. Rich, creamy, perfectly set. Will order every birthday!",
                name: "Penny Abok",
                location: "Kisumu",
                avatar: "PA"
              },
            ].map((review, i) => (
              <Card key={i} className="reveal p-6" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="size-4 fill-[var(--star-gold)] text-[var(--star-gold)]" />
                  ))}
                </div>
                <p className="text-sm mb-6 leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ background: 'var(--badge-bg)', color: 'var(--primary)' }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{review.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {review.location}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="reveal flex flex-wrap items-center justify-center gap-8 p-6 rounded-2xl" style={{ background: 'var(--bg-section)' }}>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                5,000+
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Cakes Baked
              </div>
            </div>
            <Separator orientation="vertical" className="h-12 hidden md:block" />
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                4.9/5
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Avg Rating
              </div>
            </div>
            <Separator orientation="vertical" className="h-12 hidden md:block" />
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                10+
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Flavors
              </div>
            </div>
            <Separator orientation="vertical" className="h-12 hidden md:block" />
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                15
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Award Wins
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section id="booking" className="py-20" style={{ background: 'var(--bg-section)' }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal space-y-6">
              <h2
                className="text-4xl md:text-5xl font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Ready to Order Your Dream Cake?
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                Book your order online or call us today, we'll take care of every delicious detail.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5" style={{ color: 'var(--primary)' }} />
                  <span>Easy online booking available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5" style={{ color: 'var(--primary)' }} />
                  <span>Speak to a cake designer instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5" style={{ color: 'var(--primary)' }} />
                  <span>Free delivery on orders above $80</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5" style={{ color: 'var(--primary)' }} />
                  <span>Freshness guaranteed — always first!</span>
                </div>
              </div>
            </div>

            <Card className="reveal p-8 shadow-xl" style={{ borderRadius: '24px' }}>
              <h3 className="text-2xl font-bold mb-6">Book Your Cake</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Full Name
                    </label>
                    <Input placeholder="John Doe" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Phone Number
                    </label>
                    <Input placeholder="+254 700 000000" className="rounded-lg" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                    Email Address
                  </label>
                  <Input type="email" placeholder="john@example.com" className="rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Cake Type
                    </label>
                    <Select>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select cake type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Layer Cake</SelectItem>
                        <SelectItem value="cupcake">Cupcake Bundle</SelectItem>
                        <SelectItem value="cheesecake">Cheesecake</SelectItem>
                        <SelectItem value="wedding">Wedding Tier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Size
                    </label>
                    <Select>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1kg">1kg</SelectItem>
                        <SelectItem value="2kg">2kg</SelectItem>
                        <SelectItem value="3kg">3kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Date
                    </label>
                    <Input type="date" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Time
                    </label>
                    <Input type="time" className="rounded-lg" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full h-12 font-semibold text-base"
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  <Cake className="size-5 mr-2" />
                  Book Appointment
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ background: 'var(--white)' }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cake className="size-8 text-primary" />
                <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  CakeCraft
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Baking joy into every celebration
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="size-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: 'var(--badge-bg)' }}
                  aria-label="Facebook"
                >
                  <svg className="size-4" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="size-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: 'var(--badge-bg)' }}
                  aria-label="Instagram"
                >
                  <svg className="size-4" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="size-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: 'var(--badge-bg)' }}
                  aria-label="Twitter"
                >
                  <svg className="size-4" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <li><a href="#" className="hover:text-primary transition-colors">Custom Cakes</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cupcakes</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Wedding Tiers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cheesecakes</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gift Vouchers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
            <p>© 2025 CakeCraft. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="size-4 fill-red-500 text-red-500" /> in Nairobi
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
