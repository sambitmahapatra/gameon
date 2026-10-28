'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrandPhoto } from '@/components/brand-photo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { MENU, MENU_CATEGORIES } from '@/lib/data/menu';
import { inrDigits } from '@/lib/utils';

export function MenuBrowser() {
  const [tab, setTab] = useState('snacks');
  const reduced = useReducedMotion();
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="flex-wrap gap-2 bg-transparent p-0">
        {MENU_CATEGORIES.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="chip data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-brand-foreground"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={reduced ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
          transition={{ duration: reduced ? 0 : 0.24 }}
        >
          <TabsContent value={tab} forceMount className="mt-10">
            <p className="mb-8 text-meta text-fg-muted">
              {MENU_CATEGORIES.find((c) => c.id === tab)?.note}
            </p>
            <motion.ul
              className="menu-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: reduced ? 0 : 0.08 } },
              }}
            >
              {MENU.filter((item) => item.category === tab).map((item) => (
                <motion.li
                  key={item.slug}
                  className="menu-item"
                  variants={{
                    hidden: { opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.97 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: reduced ? 0 : 0.24 },
                    },
                  }}
                >
                  <div className="menu-item__photo">
                    <BrandPhoto
                      src={`/images/menu/${item.slug}.webp`}
                      alt={item.name}
                      width={800}
                      height={800}
                      sizes="120px"
                    />
                    <span
                      className={`diet-marker ${item.veg ? 'diet-marker--veg' : 'diet-marker--chicken'}`}
                      role="img"
                      aria-label={item.veg ? 'Vegetarian' : 'Contains chicken'}
                      title={item.veg ? 'Vegetarian' : 'Contains chicken'}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[1.05rem] font-medium leading-snug">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-meta text-fg-muted">{item.description}</p>
                    <span className="mono mt-3 block text-fg">
                      ₹{inrDigits(item.price)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
}
