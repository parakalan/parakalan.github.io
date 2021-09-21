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
		* First thought is to add redundancy to individual hardware components in order to reduce the failure rate of the system. If the primary component dies, the redundant component can take its place while being fixed. This approach can keep machines running uninterrupted for years.
		* Until recently, the above approach was sufficient for most applications. As long as you can restore backup onto a new machine, things can run fairly smooth. Multi-machine redundancy _(A complete copy of the system I guess)_ was required only by a few applications where downtime would be catastrophic.
		* But now, data volumes and computing requirements have increased, increasing the number of machines to run the applications. This increases the rate of hardware faults. Also, in cloud service providers like AWS, the nodes can become unavailable without warning, since these platforms optmize or elasticity and flexibility over machine reliability.
		* To address the above point, there is a need for systems with software fault tolerance, to handle loss of machines. They also have operational advantage, a single server machine will need to be rebooted to apply a patch, but a system with software fault tolerance can do rolling upgrades.<br> _Kubernetes is an example of software which can handle machines becoming unavailable, providing redundancy across machines and rolling upgrades._
	* **Software Faults**: These are bugs in the application code, could be a silly error, could be based on an assumption that is no longer true.
		* Software faults have extreme correlation, one bug is going to bring every instance of the application down. Compare this with hardware faults, where the correlation is very weak, if any at all. All of the hardware is very unlikely to fail at the same time.
		* Some examples of software faults - :
			* A software bug that causes every instance of an application server to crash when given a particular bad input. Example - [The leap second glitch on June 30, 2012](https://www.wired.com/2012/07/leap-second-glitch-explained/)
			* A runaway process that uses up some shared resource—CPU time, memory, disk space, or network bandwidth.
			* A service that the system depends on that slows down, becomes unresponsive, or starts returning corrupted responses.
			* Cascading failures, where a small fault in one component triggers a fault in another component, which in turn triggers further faults.
		* These bugs lie dormant for a long time, before being triggered by an unusual set of circumstances. Usually, there is an assumption made in the code which stops being true.
		* There is no quick solution for this. A few things that can help - carefully thinking about assumptions and interactions in the system; thorough testing; process isolation; allowing processes to crash and restart; measuring, monitoring, and analyzing system behavior in production.
		* If a system is expected to provide some guarantee, it can constantly check itself while it is running and raise an alert if a discrepancy is found. _If lag builds up in Kafka, there is some issue with the consumer._
	* **Human Errors**


* **Scalability**: As the system grows in data volume, traffic volume or complexity, there should be reasonable ways of dealing with the growth.

* **Maintainability**: Over time, many different people will work on the system, and they should all be able to work on it productively.






























_Please ping me on [Twitter](https://twitter.com/parakalakavi) or share a PR if you find anything wrong_