<?php

function shield($title, $text, $color) {
	$query = http_build_query([
		'title' => $title,
		'text'  => $text,
		'color' => $color,
	]);

	return '<img src="https://img.shielded.dev/s?' . $query.'" alt="' . htmlentities($title . ' : ' . $text) . '">';
}

?>
<!doctype html>
<html>

<head>
	<?php require('_head.php') ?>
</head>

<body class="home--app">
	<?php require('_header.php') ?>
	<main>
		<section>
			<article>
				<p>Want a badge for a detail from your CI system?</p>
			</article>
		</section>
		<section>
			<article class="home-core">
				<div class="welcome">
					<h3>Welcome to Shielded.dev</h3>
					<p>Shielded.dev is a service that allows you to create custom shields for your projects.</p>
					<p>It's free and open source.</p>
				</div>
				<div class="getting-started">
					<h3>Getting Started!</h3>
					<a href="/github/login" class="github-login">Sign in with GitHub</a>
					<p>By clicking this button you accept our <a href="/privacy.html">Privacy Policy</a> and consent to two cookies.</p>
					<hr />
					<p>One cookie is for the handshake with GitHub and the other holds and verifies the returned authentication.</p>
					<p>There are zero tracking cookies used.</p>
				</div>

				<div class="examples">
					<h3>Shield Ideas</h3>
					<ul>
						<li><p>Build Status</p>
							<?= shield("Build", "passing", "28a3df") ?>
						</li>
						<li><p>Code Coverage</p>
							<?= shield("Coverage", "100%", "28a3df") ?>
						</li>
						<li><p>Code Quality</p>
							<?= shield("Quality", "A+", "green") ?>
						</li>
						<li><p>License</p>
							<?= shield("License", "MIT", "428F7E") ?>
						</li>
						<li><p>Version</p>
							<?= shield("Stable", "1.2.34", "28a3df") ?>
							<?= shield("Latest", "1.2.34", "28a3df") ?>
							<?= shield("Unstable", "8.67.5-dev", "e68718") ?>
						</li>
						<li><p>Downloads</p>
							<?= shield("Daily Downloads", "128", "28a3df") ?>
						</li>
						<li><p>Open Issues</p>
							<?= shield("Issues", "5", "99004d") ?>
						</li>
						<li><p>Open Pull Requests</p>
							<?= shield("Pull Requests", "1", "99004d") ?>
						</li>
						<li><p>Code Size</p>
							<?= shield("Code Size", "1.2mb", "5c72a6") ?>
						</li>
						<li><p>Contributors</p>
							<?= shield("Contributors", "13", "5c72a6") ?>
						</li>
						<li><p>Commit Activity</p>
							<?= shield("Commits", "2/week", "28a3df") ?>
						</li>
						<li><p>Release Activity</p>
							<?= shield("Releases", "1/month", "28a3df") ?>
						</li>
					</ul>
				</div>
			</article>
		</section>
		<section>
			<article>
				<h3>API Examples</h3>
				<div id="api-example"></div>
			</article>
		</section>
		<section>
			<article>
				<h3>Open Source</h3>
				<p>Want to run your own instance? The entire source code is freely availbile on GitHub.</p>
			</article>
		</section>
	</main>
	<script>
		document.addEventListener('DOMContentLoaded', function () {
			shielded.Home(document.getElementById('api-example'));
		});
	</script>
	<?php require('_footer.php') ?>
</body>

</html>
