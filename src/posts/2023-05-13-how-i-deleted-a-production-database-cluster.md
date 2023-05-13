---
title: How I Deleted a Production Database Cluster
tags:
  - mongodb
  - reflection
date: 2023-03-12
---

On February 26, 2023, I was doing some humdrum server and deployment housekeeping for services I ran. Looking at the [MongoDB Atlas](https://www.mongodb.com/atlas/database) database for [Blåhaj](https://github.com/ryanccn/blahaj), my Discord bot, I noticed that it was hibernating. Which made sense, because I had removed the features that required a MongoDB database and switched to [Railway Redis](https://docs.railway.app/databases/redis) for the simpler features. I went ahead to delete the cluster, but then some unknown supernatural force logged me out. I was slightly annoyed and logged back in. (Note that the logging in process didn’t take any mental effort because [1Password](https://1password.com/) did all the work.) Then, I went ahead to open up the Blåhaj project. I went to the cluster settings page, annoyed and wanting to finish up everything quickly, and clicked **delete cluster**.

{% respimg 'images/delete-production-database/3dde9e97.png', 'Dialog saying "Unable to terminate this cluster"' %}

MongoDB Atlas’s [Termination Protection](https://www.mongodb.com/docs/atlas/cluster-additional-settings/#termination-protection) promptly kicked in. So I went to Edit Configuration, turned off termination protection, and deleted the cluster.

{% respimg 'images/delete-production-database/f42222ba.png', 'Termination Protection, turned off' %}

Then I turned off my computer and went to do something else.

---

Later that day, I decided to go back to my computer to work on [Moddermore](https://moddermore.net/), a content-oriented SaaS I run with nearly 1k users, for a bit. I happened to be using the remote cluster for my own local development as well (bad habit, I know), and when I started my dev server, it started throwing `ENOTFOUND` errors — that the hostname could not be found.

Huh, I thought. That was weird. My first reaction was that it was a network issue, which also made sense because I have a very complex and messy network and DNS setup. I restarted my computer to see if it would fix the issue.

It didn’t.

I started to have some vague idea of what had happened and nervously opened Moddermore’s staging deployment. It loaded for a few seconds and returned a 500. Then I went to the production site; it did the same.

I went to the MongoDB Atlas dashboard, suddenly painfully aware of what I had done. Recognition and reversal of fortune, tragedians would have called it. True enough, when I opened the projects page, there was no Moddermore, but Blåhaj was there. By force of habit, I had opened the project for Moddermore upon logging in, and with the generic cluster name, I had simply deleted the entire database without even noticing once the name of the project.

I searched desperately for a way to recover any backups, but the M0 free cluster did not include any backups and I didn’t do any backups myself onto cloud storage providers or even to my personal computer. The data was effectively lost.

## Why did this happen?

### 1. Careless naming

When I named the cluster at first, I just went with the default name of Cluster0, because, well, there was only one cluster on the project after all and I thought it would do no harm.

{% respimg 'images/delete-production-database/d9af9621.png', 'Dialog prompting confirmation to terminate Cluster0' %}

As it turns out, this probably was the only safeguard against deletion that would have required at least some amount of conscious mental effort, but by naming the cluster in such a generic way, I voided this safeguard as well.

### 2. Thrift

As a student and hobbyist web developer, I was hesitant about upgrading my database to include backups. This had always worked fine for my previous projects, because in the end only a few (developer) friends and myself were using them. When the data disappeared into thin air, it wasn’t much of a big deal; we just reuploaded the things we needed and went on using it.

What I had always known but didn’t act on was that Moddermore was way past the stages that these previous projects had been at. It had nearly 1,000 users, megabytes of data, and even more importantly, it was a content-oriented SaaS. You created content on the website, saved it there, and shared the link with other people. A database wipe on something of this nature would be devastating to the entire product and its userbase.

Indeed, even now, a whole month after the incident, the top pages being visited on the Moddermore website are still 404s. And I had no way of knowing who owned these 404ing lists and how to contact them and tell them of what I had unfortunately done.

### 3. Overconfidence

Even if M0 clusters didn’t include backups by default, there were always other ways to make restoreable backups of the database. In my current setup, I use a periodic cron job on my computer to run [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) on the production database and upload the archive to a [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) bucket. This cloud backup setup works very well, is resilient, and is still free. I didn’t bother to even set up something like this before because I trusted myself to not do anything as stupid as deleting a production database. But apparently, I did, so here we are writing a postmortem.

### 4. Mind-wandering, or the Default Mode Network

When the perceptual demand of a task decreases, the attention paid to said task by the brain also goes down, and it goes into a somewhat automatic or “wandering” mode, powered by what is known as the default mode network in neuroscience. Although [recent studies](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6140531) have challenged the default mode network’s connection to the phenomenon of mind-wandering, it is [generally believed](https://pubmed.ncbi.nlm.nih.gov/18400922/) that the DMN is commonly active during periods of rest and mind-wandering, when the task on hand is not being focused upon. A prominent example is that of traffic accidents: the prevalence of accidents on straight, easy to navigate roads [is suggested to be](https://pubmed.ncbi.nlm.nih.gov/28771623/) caused by mind-wandering when drivers do not focus on their driving and instead start thinking about unrelated things.

A similar process seems to have occurred when I went through the steps to delete the database. I’ve used MongoDB Atlas for quite a while, so the user interface and controls were all too familiar to me; I had a few exams coming up in the coming week, and the need to review for them lingered on my mind. Deleting the database did not require any mental input at all. If I was asked to spell the name of the project and the cluster backwards to confirm deletion, I probably would have had to mentally focus on the name and realized what I was doing. However, the relative simplicity of the process and my experience with it led me astray.

## So what now?

I have acquired a few takeaways from this whole debacle.

1. **Make backups.** Never have a single point of failure. I’ve also started to back up my Mac with Time machine after the incident — you can never be too sure of what will happen next. Backup your devices and cloud services; keep a spare key; prepare Plan Bs for unexpected circumstances.
2. **Build better confirmation UIs.** This is a more web developer-oriented takeaway. Next time I build a confirmation UI, I will make sure that it requires a conscious mental effort to complete. Not in the annoying way that captchas do, but simple enough to grab your attention.
3. **Think before you perform destructive actions.** Any destructive action can have potentially unwanted consequences, or you might’ve made a mistake in the process. Moreover, destructive actions are often irreversible, so better think before you do anything of the sort.
4. **Know thyself.** Don’t be too sure of yourself — I’m a pretty absentminded person in reality, and this extends to my informal developer life as well. Also realize the extent of your responsibility: a few friends’ and a thousand users’ data are drastically different in magnitude and importance. I had retained the mindset of making something for myself on a public SaaS; that never would have worked out well.

Without a functional announcement/blog system and a large enough community, I was very unfortunately quite out of touch with my users; I had to give notice through a red banner on the website which undoubtedly was detrimental to signup conversions and user confidence.

All I can say now is, I am very sorry that everything happened, and I have learnt my lesson.
