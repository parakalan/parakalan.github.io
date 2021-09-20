---
exclude: true
---
# Reliable, Scalable and Maintainable Applications

_"The Internet was done so well that most people think of it as a natural resource like the Pacific Ocean, rather than something that was man-made. When was the last time a technology with a scale like that was so error-free?" - Alan Kay_

* Applications today are data intensive, as opposed to compute intensive.

* In more recent years, the lines between different data systems are blurred. There are datastore like Redis which are used as message queues, there are messages queues like Kafka which have enough durability to work as databases. (["Postgres Full-Text Search is Good Enough!"](http://rachbelaid.com/postgres-full-text-search-is-good-enough/))<br>_We (my friend and I) used Redis as a message queue for scraping stuff off Amazon for a very short lived project. Worked like a charm._

* Applications today have demanding and wide ranging expectations that one tool cannot solve everything. It is the responsibility of the application code to keep all these systems in sync.
<br>_The scraping I mentioned above needed us to deploy Redis, RabbitMQ and Postgres instance on DO. Part of the reason could have been our inefficiency, but felt like all that was needed to do the scraping at scale._

* **Reliability**: The system should work correctly (with desired level of performance) even in the face of adversity.
* For a software to work correctly, these are the expectations -
	* The application performs the function the user expected.
	* It can tolerate the user making mistakes or using the software in unexpected ways.
	* Its performance is good enough for the required use case, under the expected load and data volume.
	* The system prevents any unathourized access and abuse.
* If a system continues to "work correctly", based on above conditions, it is reliable. Reliability = working correctly across time.

* Things that can go wrong are called faults. A reliable system is _fault tolerant_ or _resilient_. We can tolerate only certain types of faults though. A system failure is different from a fault. A fault is when one component of a system deviates from spec, a failure is when the whole system stops providing the required service.<br>_Let's take some time to understand the difference, seems to be important. A program which runs the node out of memory is a fault, which makes the node go out of reach, or restart, which is a failure. Not all faults are equally fatal. A security loophole is a fault, which is very fatal to the system, as compared to out-of-memory faults._

* We generally prefer tolerating faults over preventing them, but in some cases the latter is better. If an attacker has compromised a system and gained access to sensitive data, it cannot be undone.

* **Hardware Faults**: Hard disk crashes, RAM becoming faulty, power grid blackout, unplugging the wrong cable - these things happen all the time in large datacenters.
	* Hard disks are reported to have mean time to failure of 10 to 50 years. On a storage cluster with 10,000 disks, on average one disk dies per day.

* **Scalability**: As the system grows in data volume, traffic volume or complexity, there should be reasonable ways of dealing with the growth.

* **Maintainability**: Over time, many different people will work on the system, and they should all be able to work on it productively.






























_Please ping me on [Twitter](https://twitter.com/parakalakavi) or share a PR if you find anything wrong_