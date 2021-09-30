---
exclude: true
---
# Reliable, Scalable and Maintainable Applications

_"The Internet was done so well that most people think of it as a natural resource like the Pacific Ocean, rather than something that was man-made. When was the last time a technology with a scale like that was so error-free?" - Alan Kay_

* Applications today are data intensive, as opposed to compute intensive.

* In more recent years, the lines between different data systems are blurred. There are datastore like Redis which are used as message queues, there are messages queues like Kafka which have enough durability to work as databases. (["Postgres Full-Text Search is Good Enough!"](http://rachbelaid.com/postgres-full-text-search-is-good-enough/))<br>_We (my friend and I) used Redis as a message queue for scraping stuff off Amazon for a very short lived project. Worked like a charm._

* Applications today have demanding and wide ranging expectations that one tool cannot solve everything. It is the responsibility of the application code to keep all these systems in sync.
<br>_The scraping I mentioned above needed us to deploy Redis, RabbitMQ and Postgres instance on DO. Part of the reason could have been our inefficiency, but felt like all that was needed to do the scraping at scale._

* **[Reliability](/design-data-intensive-apps/1-1-reliability.html)**: The system should work correctly (with desired level of performance) even in the face of adversity

* **[Scalability]()**: As the system grows in data volume, traffic volume or complexity, there should be reasonable ways of dealing with the growth.

* **[Maintainability]()**: Over time, many different people will work on the system, and they should all be able to work on it productively.






























_Please ping me on [Twitter](https://twitter.com/parakalakavi) or share a PR if you find anything wrong_